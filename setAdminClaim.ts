import { initializeApp, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import * as fs from "fs";

// 서비스 계정 키 경로
const serviceAccount = JSON.parse(
  fs.readFileSync("./firebase-adminsdk.json", "utf8")
);

// Firebase Admin 초기화
initializeApp({
  credential: cert(serviceAccount),
});

// ✅ 관리자 권한 부여할 사용자 이메일
const targetEmail = "nice00ricky@gmail.com";

async function setAdminClaim() {
  try {
    const user = await getAuth().getUserByEmail(targetEmail);
    await getAuth().setCustomUserClaims(user.uid, { user_type: "admin" });

    console.log(`✅ 관리자 권한 부여 완료: ${user.email}`);
  } catch (err) {
    console.error("❌ 오류 발생:", err);
  }
}

setAdminClaim();
