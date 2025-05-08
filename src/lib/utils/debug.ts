// 예: src/utils/debug.ts
import { getAuth } from "firebase/auth";

(window as any).getToken = async () => {
  const user = getAuth().currentUser;
  if (!user) {
    console.warn("⛔ 로그인된 사용자가 없습니다.");
    return;
  }
  const token = await user.getIdToken();
  console.log("✅ ID Token:", token);
  return token;
};
