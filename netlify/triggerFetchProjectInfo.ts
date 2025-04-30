// netlify/functions/triggerFetchProjectInfo.ts

import { Handler } from '@netlify/functions';

const handler: Handler = async () => {
  const GITHUB_TOKEN = process.env.GITHUB_TOKEN!;
  const GITHUB_REPO = 'blockdreamers/Kuest3'; // ✅ 실제 GitHub 경로
  const WORKFLOW_FILENAME = 'fetchProjectInfo.yml'; // ✅ 워크플로우 파일명 (.github/workflows 내부)

  const triggerUrl = `https://api.github.com/repos/${GITHUB_REPO}/actions/workflows/${WORKFLOW_FILENAME}/dispatches`;

  try {
    const res = await fetch(triggerUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${GITHUB_TOKEN}`,
        Accept: 'application/vnd.github+json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ref: 'main', // ✅ 실행할 브랜치 (main 기준)
      }),
    });

    if (!res.ok) {
      const text = await res.text();
      return {
        statusCode: res.status,
        body: `❌ GitHub Action 트리거 실패: ${text}`,
      };
    }

    return {
      statusCode: 200,
      body: '✅ GitHub Action 성공적으로 트리거됨!',
    };
  } catch (err: any) {
    return {
      statusCode: 500,
      body: `서버 오류: ${err.message}`,
    };
  }
};

export default handler; // ✅ Netlify 함수 인식용 export 방식
