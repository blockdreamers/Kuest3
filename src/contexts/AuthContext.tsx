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
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL!,
  import.meta.env.VITE_SUPABASE_ANON_KEY!
);

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
          console.log("✅ Redirect 로그인 성공:", result.user);
          if (!isPreview) toast.success('로그인이 완료되었습니다!');
          window.location.href = '/';
        }
      } catch (error) {
        console.error("🔥 Redirect Result Error:", error);
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
        await signInWithRedirect(auth, googleProvider);
        return;
      }

      const result = await signInWithPopup(auth, googleProvider);
      const currentUser = result.user;
      console.log("✅ Firebase 로그인 성공:", currentUser);
      setUser(currentUser);

      const { data: existingUser, error: existingUserError } = await supabase
        .from('users')
        .select('id')
        .eq('id', currentUser.uid)
        .single();

      if (existingUserError) {
        console.error("❌ Supabase 유저 조회 실패:", existingUserError);
      }

      const isNewUser = !existingUser;
      console.log("🆕 Is new user:", isNewUser);

      if (isSignUp && isNewUser) {
        toast.loading('지갑 연결 중...', { id: 'wallet-connect' });

        try {
          await privyLogin();

          let wallets = [];
          let retries = 0;
          while (retries < 10 && wallets.length === 0) {
            wallets = await getWallets();
            console.log(`🔁 Retry ${retries + 1}: wallets=`, wallets);
            await new Promise((res) => setTimeout(res, 300));
            retries++;
          }

          if (wallets.length === 0) throw new Error('지갑 연결이 되지 않았습니다.');

          const { error: userInsertError, status: userInsertStatus } = await supabase.from('users').insert({
            id: currentUser.uid,
            email: currentUser.email,
            display_name: currentUser.displayName,
            photo_url: currentUser.photoURL,
            user_type: 'normal',
            created_at: new Date().toISOString(),
            last_login_at: new Date().toISOString(),
            is_active: true,
          });

          console.log('📤 users insert status:', userInsertStatus);
          console.log('📤 users insert error:', userInsertError);


          console.log('📤 Supabase users insert:', userInsertStatus, userInsertError);
          if (userInsertError) throw userInsertError;

          const { error: walletInsertError, status: walletInsertStatus } = await supabase.from('user_wallets').insert({
            user_id: currentUser.uid,
            wallet_address: wallets[0].address,
            created_at: new Date().toISOString(),
          });

          console.log('📤 user_wallets insert status:', walletInsertStatus);
          console.log('📤 user_wallets insert error:', walletInsertError);

          console.log('📤 Supabase wallet insert:', walletInsertStatus, walletInsertError);
          if (walletInsertError) throw walletInsertError;

          toast.success('회원가입이 완료되었습니다!', { id: 'wallet-connect' });
        } catch (error) {
          console.error('❌ 회원가입 실패 전체 에러:', error);
          toast.error('회원가입 실패: 지갑 연결에 실패했습니다.', { id: 'wallet-connect' });
          await firebaseSignOut(auth);
          setUser(null);
          setTimeout(() => (window.location.href = '/login'), 1500);
          return;
        }
      } else {
        toast.success('로그인이 완료되었습니다!');
      }

      window.location.href = '/';
    } catch (error: any) {
      console.error("🔥 Auth Error:", error);
      if (error.code === 'auth/popup-blocked') {
        toast.error('팝업이 차단되었습니다. 팝업 차단을 해제하고 다시 시도해 주세요.');
      } else {
        toast.error('로그인 중 오류가 발생했습니다');
      }
      throw error;
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
      console.error("🔥 Sign Out Error:", error);
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
