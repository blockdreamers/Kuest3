// lib/auth/googleAuth.ts
import {
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  User,
} from 'firebase/auth';
import { auth, googleProvider } from '../../config/firebase';
import { isPreview } from '../../config/environment';
import toast from 'react-hot-toast';

/**
 * Firebase 리디렉션 결과 핸들링
 */
export const handleRedirectAuth = async (
  setUser: (user: User | null) => void
) => {
  try {
    const result = await getRedirectResult(auth);
    if (result?.user) {
      setUser(result.user);
      console.log('✅ Redirect 로그인 성공:', result.user);
      if (!isPreview) toast.success('로그인이 완료되었습니다!');
      window.location.href = '/';
    }
  } catch (error) {
    console.error('🔥 Redirect Result Error:', error);
    toast.error('로그인 중 오류가 발생했습니다');
  }
};

/**
 * Popup 방식으로 구글 로그인 실행 (Firebase)
 */
export const signInWithGooglePopup = async (): Promise<User> => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    console.log('✅ Firebase 로그인 성공:', result.user);
    return result.user;
  } catch (error: any) {
    console.error('🔥 Firebase Auth 에러:', error);
    if (error.code === 'auth/popup-blocked') {
      toast.error('팝업이 차단되었습니다. 팝업 차단을 해제하고 다시 시도해 주세요.');
    } else {
      toast.error('로그인 중 오류가 발생했습니다');
    }
    throw error;
  }
};

/**
 * 프리뷰 환경에서는 Redirect 기반 로그인으로 전환
 */
export const previewRedirectLogin = async () => {
  console.log('🧪 Preview 모드 → Redirect로 로그인');
  await signInWithRedirect(auth, googleProvider);
};
