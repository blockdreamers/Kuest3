// netlify/functions/fetchApplications.ts
import { Handler } from '@netlify/functions';
import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { createClient } from '@supabase/supabase-js';

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

const auth = getAuth();

// ✅ Supabase 관리자 클라이언트
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const handler: Handler = async (event) => {
  try {
    console.log("📥 [fetchApplications] 함수 진입");

    // ✅ 1. 인증 헤더 파싱
    const authHeader = event.headers.authorization || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;

    if (!token) {
      console.warn("⛔ 토큰 없음");
      return {
        statusCode: 401,
        body: JSON.stringify({ message: "Unauthorized: No token provided" }),
      };
    }

    // ✅ 2. 토큰 검증 → uid 획득
    const decodedToken = await auth.verifyIdToken(token);
    const uid = decodedToken.uid;
    console.log("✅ 인증된 Firebase uid:", uid);

    // ✅ 3. Supabase에서 유저 권한 확인
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("user_type")
      .eq("id", uid)
      .maybeSingle();

    if (userError) {
      console.error("❌ Supabase 유저 조회 실패:", userError.message);
      return {
        statusCode: 500,
        body: JSON.stringify({ error: userError.message }),
      };
    }

    if (!userData || userData.user_type !== "admin") {
      console.warn("⛔ 관리자 권한 없음 또는 user_type 불일치");
      return {
        statusCode: 403,
        body: JSON.stringify({ message: "Forbidden: Admins only" }),
      };
    }

    // ✅ 4. 프로젝트 신청 목록 불러오기
    const { data: applications, error: fetchError } = await supabase
      .from("listing_applications")
      .select("*")
      .order("submitted_at", { ascending: false });

    if (fetchError) {
      console.error("❌ 신청 목록 조회 실패:", fetchError.message);
      return {
        statusCode: 500,
        body: JSON.stringify({ error: fetchError.message }),
      };
    }

    console.log("📦 신청 개수:", applications?.length ?? 0);

    return {
      statusCode: 200,
      body: JSON.stringify(applications ?? []),
    };
  } catch (err: any) {
    console.error("💥 예외 발생:", err.message);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message || "Internal Server Error" }),
    };
  }
};

export { handler };
