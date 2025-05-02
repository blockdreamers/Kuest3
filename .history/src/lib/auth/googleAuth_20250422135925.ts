// 📄 src/lib/auth/googleAuth.ts

import {
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  User,
} from 'firebase/auth';
import { auth, googleProvider } from '../../config/firebase';
import { isPreview } from '../../config/environment';
import toast from 'react-hot-toast';
import { insertSupabaseUser } from './supabaseUser'; // ✅ 추가: Supabase 삽입 함수

/**
 * Firebase 팝업 로그인 실행
 */
export const signInWithGooglePopup = async (): Promise<User> => {
  const isLocalhost =
    typeof window !== 'undefined' && window.location.hostname === 'localhost';

  try {
    if (isPreview) {
      console.log('🧪 Preview 환경 → Redirect 로그인');
      await signInWithRedirect(auth, googleProvider);
      return new Promise(() => {});
    }

    console.log('🖱️ 팝업 로그인 시도 중...');
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;

    console.log('✅ Firebase 로그인 성공 (팝업):', user);

    // ✅ Supabase에 유저 정보 삽입
    await insertSupabaseUser({
      id: user.uid,
      email: user.email ?? null,
      nickname: user.displayName ?? null,
      photo: user.photoURL ?? null,
      user_type: 'normal',
      is_active: true,
    });

    return user;
  } catch (error: any) {
    console.error('🔥 Firebase Auth 에러:', error);

    if (error.code === 'auth/popup-blocked') {
      toast.error('팝업이 차단되었습니다. 팝업 차단을 해제하고 다시 시도해 주세요.');
    } else if (error.code === 'auth/cancelled-popup-request') {
      toast.error('이미 열려 있는 로그인 팝업이 있습니다. 창을 닫고 다시 시도해 주세요.');
    } else {
      toast.error('로그인 중 오류가 발생했습니다');
    }

    throw error;
  }
};
