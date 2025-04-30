import { Handler } from '@netlify/functions';
import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { createClient } from '@supabase/supabase-js';

// ✅ Firebase Admin 초기화 (이미 초기화 안 됐으면)
if (getApps().length === 0) {
  initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  });
}

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // 🔐 관리자 권한 키
);

const handler: Handler = async (event) => {
  try {
    // ✅ 1. Authorization 헤더에서 토큰 추출
    const authHeader = event.headers.authorization || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;

    if (!token) {
      return {
        statusCode: 401,
        body: JSON.stringify({ message: 'Unauthorized: No token provided' }),
      };
    }

    // ✅ 2. Firebase 토큰 검증
    const decoded = await getAuth().verifyIdToken(token);
    const uid = decoded.uid;

    // ✅ 3. Supabase에서 해당 uid의 user_type이 admin인지 확인
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('user_type')
      .eq('id', uid)
      .maybeSingle();

    if (userError || !userData || userData.user_type !== 'admin') {
      return {
        statusCode: 403,
        body: JSON.stringify({ message: 'Forbidden: Admins only' }),
      };
    }

    // ✅ 4. 관리자만 전체 유저 목록 조회
    const { data, error } = await supabase
      .from('users')
      .select(`
        id,
        email,
        user_type,
        last_login_at,
        user_wallets(wallet_address, provider)
      `);

    if (error) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: error.message }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify(data),
    };
  } catch (err: any) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message || 'Unknown error' }),
    };
  }
};

export { handler };
