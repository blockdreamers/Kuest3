// src/lib/api/fetchTwitterPosts.ts

import axios from 'axios';

const BEARER_TOKEN = process.env.NEXT_PUBLIC_TWITTER_BEARER_TOKEN!;

export async function fetchLatestTweets(handle: string): Promise<string[]> {
  try {
    const userRes = await axios.get(`https://api.twitter.com/2/users/by/username/${handle}`, {
      headers: { Authorization: `Bearer ${BEARER_TOKEN}` },
    });

    const userId = userRes.data.data.id;

    const tweetsRes = await axios.get(`https://api.twitter.com/2/users/${userId}/tweets`, {
      headers: { Authorization: `Bearer ${BEARER_TOKEN}` },
      params: {
        'max_results': 2,
        'exclude': 'replies,retweets',  // 리트윗, 답글 제외하고 순수 트윗만
      },
    });

    const tweetIds = tweetsRes.data.data.map((tweet: any) => tweet.id);
    return tweetIds;
  } catch (err) {
    console.error('트윗 가져오기 실패:', err);
    return [];
  }
}

export function extractHandleFromTwitterUrl(url: string): string | null {
  try {
    if (!url) return null;
    let handle = url.replace('https://twitter.com/', '')
                    .replace('https://x.com/', '')
                    .split(/[/?]/)[0];
    return handle || null;
  } catch (err) {
    console.error('Twitter 핸들 추출 실패:', err);
    return null;
  }
}