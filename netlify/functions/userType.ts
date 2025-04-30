import { Handler } from '@netlify/functions';
import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { createClient } from '@supabase/supabase-js';

console.log("🔥 Firebase Key 확인:");
console.log(process.env.FIREBASE_PRIVATE_KEY);

// ✅ 환경 변수 확인 로그
console.log('🧪 ENV FIREBASE_PROJECT_ID:', process.env.FIREBASE_PROJECT_ID);
console.log('🧪 ENV FIREBASE_CLIENT_EMAIL:', process.env.FIREBASE_CLIENT_EMAIL);
console.log('🧪 ENV FIREBASE_PRIVATE_KEY START:', process.env.FIREBASE_PRIVATE_KEY?.slice(0, 30));
console.log('🧪 ENV SUPABASE_URL:', process.env.SUPABASE_URL);
console.log('🧪 ENV SUPABASE_SERVICE_ROLE_KEY START:', process.env.SUPABASE_SERVICE_ROLE_KEY?.slice(0, 10));

// ✅ Firebase Admin SDK 초기화
if (getApps().length === 0) {
  initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  });
}

const adminAuth = getAuth();

// ✅ Supabase 초기화
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// ✅ Netlify Function Handler
const handler: Handler = async (event) => {
  try {
    console.log('🔥 userType 호출 시작');

    // ✨ Authorization 헤더에서 토큰 추출
    const authHeader = event.headers.authorization || '';
    console.log('📦 Authorization Header:', authHeader);

    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
    console.log('📦 Extracted Token:', token?.slice(0, 20));

    if (!token) {
      console.error('❌ 인증 토큰 없음');
      return {
        statusCode: 401,
        body: JSON.stringify({ message: 'No authorization token found' }),
      };
    }

    // ✨ Firebase 토큰 검증
    const decodedToken = await adminAuth.verifyIdToken(token);
    console.log('✅ Decoded Firebase Token:', decodedToken);

    const userId = decodedToken.uid;
    console.log('✅ 인증된 Firebase uid:', userId);

    // ✨ Supabase에서 user_type 조회
    const { data, error } = await supabase
      .from('users')
      .select('user_type')
      .eq('id', userId)
      .maybeSingle();

    console.log('📦 Supabase 조회 결과:', data, error);

    if (error) {
      console.error('❌ Supabase users 조회 실패:', error.message);
      return {
        statusCode: 500,
        body: JSON.stringify({ message: 'Failed to fetch user_type' }),
      };
    }

    if (!data) {
      console.error('❌ 해당 유저 없음');
      return {
        statusCode: 404,
        body: JSON.stringify({ message: 'User not found' }),
      };
    }

    console.log('✅ user_type 조회 성공:', data.user_type);

    return {
      statusCode: 200,
      body: JSON.stringify({ user_type: data.user_type }),
    };
  } catch (err: any) {
    console.error('🔥 Function 실행 실패 전체 오류:', err);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: 'Internal server error',
        error: err?.message || 'Unknown error',
        stack: err?.stack || 'No stack trace',
      }),
    };
  }
};

// ✅ CommonJS 형식으로 export
export { handler };
