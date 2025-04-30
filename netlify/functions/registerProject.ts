// netlify/functions/registerProject.ts
import { Handler } from '@netlify/functions';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { slug, nameKo, tvSymbol, season } = JSON.parse(event.body || '{}');

    if (!slug || !nameKo || !season) {
      return { statusCode: 400, body: '❌ 필수 항목 누락 (slug, nameKo, season)' };
    }

    // Step 1. project_info에 삽입 (트리거로 voting_status 자동 생성)
    const { error: insertError } = await supabase.from('project_info').insert({
      id: slug,
      slug,
      name_ko: nameKo,
      tradingview_symbol: tvSymbol,
    });

    if (insertError) {
      return {
        statusCode: 500,
        body: `❌ project_info 등록 실패: ${insertError.message}`,
      };
    }

    // Step 2. 트리거로 생성된 voting_status에 season 업데이트
    const { error: seasonError } = await supabase
      .from('voting_status')
      .update({ season })
      .eq('project_id', slug);

    if (seasonError) {
      return {
        statusCode: 500,
        body: `❌ season 업데이트 실패: ${seasonError.message}`,
      };
    }

    // Step 3. GitHub Action 트리거
    const triggerUrl = `https://api.github.com/repos/blockdreamers/Kuest3/actions/workflows/fetchProjectInfo.yml/dispatches`;
    const ghRes = await fetch(triggerUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
        Accept: 'application/vnd.github+json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ref: 'main' }),
    });

    if (!ghRes.ok) {
      const text = await ghRes.text();
      return {
        statusCode: 500,
        body: `❌ GitHub Action 트리거 실패: ${text}`,
      };
    }

    return {
      statusCode: 200,
      body: `✅ 등록 성공 및 GitHub Action 트리거 완료!`,
    };
  } catch (err: any) {
    return {
      statusCode: 500,
      body: `❌ 서버 에러: ${err.message}`,
    };
  }
};

export { handler };
