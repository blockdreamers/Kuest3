import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  signOut as firebaseSignOut,
  getRedirectResult,
  onAuthStateChanged,
  User,
} from 'firebase/auth';
import { usePrivy } from '@privy-io/react-auth';
import { auth } from '../config/firebase';
import { isPreview } from '../config/environment';
import toast from 'react-hot-toast';
import { signInWithGooglePopup } from '../lib/auth/googleAuth';
import { connectPrivyWallet } from '../lib/auth/privyWallet';
import { insertSupabaseUser, insertUserWallet } from '../lib/auth/supabaseUser';
import supabase from '../lib/supabase';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInWithGoogle: (isSignUp: boolean) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

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
          console.log('✅ Redirect 가입 성공:', result.user);
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
      const currentUser = await signInWithGooglePopup();
      setUser(currentUser);

      const isNewUser = await checkIfNewUser(currentUser.uid);
      console.log('🆕 Is new user:', isNewUser);

      if (isSignUp && isNewUser) {
        toast.loading('지갑 연결 중...', { id: 'wallet-connect' });
        try {
          const wallet = await connectPrivyWallet(privyLogin, getWallets);

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

          console.log('📤 Supabase 유저 insert:', userPayload);
          await insertSupabaseUser(userPayload);

          const walletPayload = {
            user_id: currentUser.uid,
            wallet_address: wallet.address,
            created_at: new Date().toISOString(),
          };

          console.log('📤 Supabase 지갑 insert:', walletPayload);
          await insertUserWallet(walletPayload);

          toast.success('회원가입이 완료되었습니다!', { id: 'wallet-connect' });
          // window.location.href = '/'; // 리디렉션은 상황 따라 주석
        } catch (error: any) {
          console.error('❌ 회원가입 실패 전체 에러:', error);
          toast.error(`회원가입 실패: ${error.message || '지갑 연결 실패'}`, {
            id: 'wallet-connect',
          });
          await firebaseSignOut(auth);
          setUser(null);
          setTimeout(() => (window.location.href = '/login'), 1500);
        }
      } else {
        toast.success('로그인이 완료되었습니다!');
        // window.location.href = '/'; // 리디렉션은 상황 따라 주석
      }
    } catch (error: any) {
      console.error('🔥 Auth Error:', error);
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
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signInWithGoogle, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

const checkIfNewUser = async (uid: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase.from('users').select('id').eq('id', uid).limit(1);
    if (error) {
      console.error('❌ Supabase 유저 조회 실패:', error.message, error.details);
      return false;
    }
    console.log('🧠 Supabase 유저 조회:', data);
    return !data || data.length === 0;
  } catch (e) {
    console.error('❌ 유저 조회 에러:', e);
    return false;
  }
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
