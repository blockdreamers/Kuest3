// netlify/functions/fetchApplications.ts
import { Handler } from '@netlify/functions';
import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { createClient } from '@supabase/supabase-js';

// ✅ Firebase Admin 초기화
if (getApps().length === 0) {
  initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  });
}

// ✅ Supabase 관리자 클라이언트 생성
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const handler: Handler = async (event) => {
  try {
    console.log('📥 [fetchApplications] 함수 진입');

    // ✅ 1. Firebase 토큰 추출
    const authHeader = event.headers.authorization || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;

    console.log('🔍 Authorization 헤더:', authHeader);

    if (!token) {
      console.warn('⚠️ 요청에 토큰 없음');
      return {
        statusCode: 401,
        body: JSON.stringify({ message: 'Unauthorized: No token provided' }),
      };
    }

    // ✅ 2. 토큰 검증 및 UID 획득
    const decoded = await getAuth().verifyIdToken(token);
    const uid = decoded.uid;
    console.log('🔐 Firebase UID:', uid);

    // ✅ 3. 관리자 여부 확인
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('user_type')
      .eq('id', uid)
      .maybeSingle();

    if (userError) {
      console.error('❌ user_type 조회 오류:', userError.message);
    }

    console.log('🧾 user_type:', userData?.user_type);

    if (!userData || userData.user_type !== 'admin') {
      console.warn('⛔ 관리자 권한 없음 또는 user_type 미일치');
      return {
        statusCode: 403,
        body: JSON.stringify({ message: 'Forbidden: Admins only' }),
      };
    }

    // ✅ 4. listing_applications 테이블 조회
    const { data, error } = await supabase
      .from('listing_applications')
      .select('*')
      .order('submitted_at', { ascending: false });

    if (error) {
      console.error('❌ Supabase 쿼리 실패:', error.message);
      return {
        statusCode: 500,
        body: JSON.stringify({ error: error.message }),
      };
    }

    console.log('📦 불러온 신청 수:', data?.length);
    if (data?.length) {
      console.log('🔍 첫 신청 미리보기:', JSON.stringify(data[0], null, 2));
    } else {
      console.log('📭 신청 데이터 없음');
    }

    // ✅ 배열 그대로 반환 (프론트에서 json.applications 아닌 배열 바로 받음)
    return {
      statusCode: 200,
      body: JSON.stringify(data ?? []),
    };
  } catch (err: any) {
    console.error('💥 예외 발생:', err.message);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message || 'Unknown error' }),
    };
  }
};

export { handler };
