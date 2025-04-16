import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User,
} from 'firebase/auth';
import { usePrivy } from '@privy-io/react-auth';
import { auth, googleProvider } from '../config/firebase';
import { isPreview } from '../config/environment';
import toast from 'react-hot-toast';
import supabase from '../lib/supabase';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInWithGoogle: (isSignUp: boolean) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function handleSupabaseError(
  error: any,
  context: string = 'Supabase 에러',
  toastId?: string
) {
  if (error) {
    console.error(`❌ ${context}:`, error.message, error.details);
    if (toastId) {
      toast.error(`${context}: ${error.message}`, { id: toastId });
    } else {
      toast.error(`${context}: ${error.message}`);
    }
    throw error;
  }
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const {
    login: privyLogin,
    authenticated: privyAuthenticated,
    logout: privyLogout,
    getWallets,
  } = usePrivy();

  useEffect(() => {
    const handleAuth = async () => {
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

      const unsubscribe = onAuthStateChanged(auth, (user) => {
        setUser(user);
        setLoading(false);
      });

      return () => unsubscribe();
    };

    handleAuth();
  }, []);

  const signInWithGoogle = async (isSignUp: boolean) => {
    try {
      if (isPreview) {
        console.log('🧪 Preview 모드 → Redirect로 로그인');
        await signInWithRedirect(auth, googleProvider);
        return;
      }
  
      const result = await signInWithPopup(auth, googleProvider);
      const currentUser = result.user;
      console.log('✅ Firebase 로그인 성공:', currentUser);
      setUser(currentUser);
  
      console.log('🔍 Supabase 기존 유저 조회 중...');
      const { data: existingUsers, error: existingUserError } = await supabase
        .from('users')
        .select('id')
        .eq('id', currentUser.uid)
        .limit(1);
  
      const existingUser = Array.isArray(existingUsers) ? existingUsers[0] : null;
  
      if (existingUserError) {
        console.error('❌ Supabase 유저 조회 실패:', existingUserError.message, existingUserError.details);
        toast.error('서버 에러가 발생했습니다.');
        return;
      }
  
      const isNewUser = !existingUser;
      console.log('🆕 Is new user:', isNewUser);
  
      if (isSignUp && isNewUser) {
        toast.loading('지갑 연결 중...', { id: 'wallet-connect' });
        console.log('👛 Privy 지갑 연결 시도 중...');
  
        try {
          await privyLogin();
  
          let wallets = [];
          for (let i = 0; i < 10; i++) {
            wallets = await getWallets();
            console.log(`🔁 Retry ${i + 1}: wallets =`, wallets);
            if (wallets.length > 0) break;
            await new Promise((res) => setTimeout(res, 300));
          }
  
          if (wallets.length === 0) throw new Error('❌ 지갑 연결 실패: 연결된 지갑이 없습니다.');
  
          const userPayload = {
            id: currentUser.uid,
            email: currentUser.email,
            display_name: currentUser.displayName,
            photo_url: currentUser.photoURL,
            user_type: 'normal',
            created_at: new Date().toISOString(),
            last_login_at: new Date().toISOString(),
            is_active: true,
          };
          console.log('📤 유저 insert payload:', userPayload);
  
          const { error: userInsertError } = await supabase
            .from('users')
            .insert(userPayload);
  
          if (userInsertError) {
            console.error('❌ userInsertError:', userInsertError.message, userInsertError.details);
            throw userInsertError;
          }
  
          const walletPayload = {
            user_id: currentUser.uid,
            wallet_address: wallets[0].address,
            created_at: new Date().toISOString(),
          };
          console.log('📤 지갑 insert payload:', walletPayload);
  
          const { error: walletInsertError } = await supabase
            .from('user_wallets')
            .insert(walletPayload);
  
          if (walletInsertError) {
            console.error('❌ walletInsertError:', walletInsertError.message, walletInsertError.details);
            throw walletInsertError;
          }
  
          toast.success('회원가입이 완료되었습니다!', { id: 'wallet-connect' });
  
          // ✅ 디버깅을 위해 리디렉션은 주석처리
          // window.location.href = '/';
  
        } catch (error: any) {
          console.error('❌ 회원가입 중 전체 에러:', error);
          toast.error(`회원가입 실패: ${error.message || '지갑 연결에 실패했습니다.'}`, {
            id: 'wallet-connect',
          });
          await firebaseSignOut(auth);
          setUser(null);
          // window.location.href = '/login';  // 디버깅 중 주석
        }
  
      } else {
        toast.success('로그인이 완료되었습니다!');
        // ✅ 디버깅을 위해 주석처리
        // window.location.href = '/';
      }
    } catch (error: any) {
      console.error('🔥 Firebase Auth 에러:', error);
      if (error.code === 'auth/popup-blocked') {
        toast.error('팝업이 차단되었습니다. 팝업 차단을 해제하고 다시 시도해 주세요.');
      } else {
        toast.error('로그인 중 오류가 발생했습니다');
      }
    }
  };
  


  const signOut = async () => {
    try {
      await Promise.all([
        firebaseSignOut(auth),
        privyAuthenticated ? privyLogout() : Promise.resolve(),
      ]);
      setUser(null);
      toast.success('로그아웃되었습니다');
    } catch (error) {
      console.error('🔥 Sign Out Error:', error);
      toast.error('로그아웃 중 오류가 발생했습니다');
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signInWithGoogle, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
