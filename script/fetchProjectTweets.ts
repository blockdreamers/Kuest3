import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';
import fetch from 'node-fetch';

// Supabase 연결
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Twitter API 설정
const BEARER_TOKEN = process.env.TWITTER_BEARER_TOKEN!;

// 1분 대기 함수
function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// 핸들 추출 함수
function extractHandle(twitterUrl: string): string | null {
  try {
    const url = new URL(twitterUrl);
    const path = url.pathname.split('/');
    return path[1] || null;
  } catch {
    return null;
  }
}

// 트위터에서 최근 트윗 가져오기
async function fetchRecentTweets(handle: string) {
  const url = `https://api.twitter.com/2/tweets/search/recent?query=from:${handle} -is:reply&tweet.fields=created_at,attachments,author_id&expansions=attachments.media_keys,author_id&media.fields=url,preview_image_url&user.fields=username,name,profile_image_url&max_results=5`;

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${BEARER_TOKEN}`,
    },
  });

  if (!res.ok) {
    throw new Error(`트윗 조회 실패 (${handle}): ${res.statusText}`);
  }

  const data = await res.json();
  return data;
}

// Supabase에 트윗 저장
async function saveTweets(projectId: string, tweets: any[], users: any[], media: any[]) {
  const records = tweets.map((tweet: any) => {
    const author = users.find((u) => u.id === tweet.author_id);
    const imageUrl = tweet.attachments?.media_keys
      ? media.find((m) => m.media_key === tweet.attachments.media_keys[0])?.url
      : null;

    return {
      project_id: projectId,
      tweet_id: tweet.id,
      content: tweet.text,
      tweet_url: author ? `https://twitter.com/${author.username}/status/${tweet.id}` : null,
      created_at: tweet.created_at,
      author_name: author?.name || null,
      author_profile_image: author?.profile_image_url || null,
      image_url: imageUrl || null,
      is_retweet: false, // 추후 리트윗 구분 가능
    };
  });

  const { error } = await supabase
    .from('project_tweets')
    .upsert(records, { onConflict: ['tweet_id'] });

  if (error) {
    console.error(`❌ 트윗 저장 실패 (${projectId}):`, error.message);
  } else {
    console.log(`✅ ${records.length}개 트윗 저장 완료 (${projectId})`);
  }
}

// 메인 실행
async function main() {
  const { data, error } = await supabase
    .from('project_info')
    .select('id, twitter')
    .neq('twitter', null);

  if (error) {
    console.error('❌ 프로젝트 목록 조회 실패:', error.message);
    return;
  }

  for (const project of data) {
    const handle = extractHandle(project.twitter);
    if (!handle) {
      console.warn(`⚠️ 핸들 추출 실패: ${project.twitter}`);
      continue;
    }

    try {
      console.log(`🚀 ${handle} 트윗 가져오는 중...`);
      const result = await fetchRecentTweets(handle);

      if (!result.data || result.data.length === 0) {
        console.log(`📭 트윗 없음: ${handle}`);
      } else {
        await saveTweets(project.id, result.data, result.includes?.users || [], result.includes?.media || []);
      }
    } catch (err: any) {
      console.error(`🚨 ${handle} 트윗 가져오기 실패: ${err.message}`);
    }

    console.log(`⏳ 1분 대기...`);
    await wait(60000); // 60초 대기
  }

  console.log('🏁 모든 프로젝트 트윗 수집 완료');
}

main();
