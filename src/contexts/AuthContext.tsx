import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User,
} from 'firebase/auth';
import { usePrivy, useWallets } from '@privy-io/react-auth';
import { auth, googleProvider } from '../config/firebase';
import { isPreview } from '../config/environment';
import toast from 'react-hot-toast';

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
  const { login: privyLogin, authenticated: privyAuthenticated, logout: privyLogout } = usePrivy();
  const { wallets } = useWallets();

  useEffect(() => {
    const handleAuth = async () => {
      try {
        const result = await getRedirectResult(auth);
        if (result?.user) {
          console.log("🔥 Redirect Result Success:", result.user);
          setUser(result.user);
          if (!isPreview) {
            toast.success('로그인이 완료되었습니다!');
          }
          window.location.href = '/';
        }
      } catch (error) {
        console.error("🔥 Redirect Result Error:", error);
        toast.error('로그인 중 오류가 발생했습니다');
      }

      const unsubscribe = onAuthStateChanged(auth, (user) => {
        console.log("🔥 Auth State Changed:", {
          loggedIn: !!user,
          email: user?.email,
          uid: user?.uid
        });
        setUser(user);
        setLoading(false);
      });

      return () => unsubscribe();
    };

    handleAuth();
  }, []);

  const signInWithGoogle = async (isSignUp: boolean) => {
    try {
      console.log("🔥 Google Sign In via", isPreview ? "Redirect" : "Popup");

      if (isPreview) {
        await signInWithRedirect(auth, googleProvider);
        return;
      }

      const result = await signInWithPopup(auth, googleProvider);
      const currentUser = result.user;
      setUser(currentUser);

      const isNewUser = currentUser.metadata.creationTime === currentUser.metadata.lastSignInTime;
      console.log("🆕 Is New User?", isNewUser);

      if (isSignUp && isNewUser) {
        toast.loading('지갑 연결 중...', { id: 'wallet-connect' });

        try {
          await privyLogin();

          // ✅ Retry wallet fetch for up to 3 seconds (10 tries)
          let retries = 0;
          while (retries < 10) {
            if (wallets.length > 0) break;
            await new Promise((res) => setTimeout(res, 300));
            retries++;
          }

          if (wallets.length === 0) {
            throw new Error('지갑 연결이 되지 않았습니다.');
          }

          toast.success('지갑이 연결되었습니다!', { id: 'wallet-connect' });
          toast.success('회원가입이 완료되었습니다!');
        } catch (error) {
          console.error('❌ Privy wallet connection failed:', error);
          toast.error('회원가입 실패: 지갑 연결에 실패했습니다.', { id: 'wallet-connect' });

          // Firebase 로그아웃 + 상태 초기화 후 리다이렉트
          await firebaseSignOut(auth);
          setUser(null);
          setTimeout(() => {
            window.location.href = '/login';
          }, 1500);
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
