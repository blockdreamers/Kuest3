import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User
} from 'firebase/auth';
import { usePrivy } from '@privy-io/react-auth';
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
  const { login: privyLogin, authenticated: privyAuthenticated } = usePrivy();

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
        window.location.href = '/login';
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
      setLoading(true);

      if (isPreview) {
        await signInWithRedirect(auth, googleProvider);
        return;
      }

      const result = await signInWithPopup(auth, googleProvider);
      console.log("🔥 Login Success", result.user);
      setUser(result.user);

      // For new users (signup), connect Privy wallet
      if (isSignUp) {
        if (privyAuthenticated) {
          toast.success('회원가입이 완료되었습니다!');
          window.location.href = '/';
          return;
        }

        const walletToastId = toast.loading('지갑 연결 중...');
        try {
          await privyLogin();
          toast.success('지갑이 연결되었습니다!', { id: walletToastId });
          toast.success('회원가입이 완료되었습니다!');
          window.location.href = '/';
        } catch (error) {
          console.error('Privy wallet connection failed:', error);
          toast.error('지갑 연결에 실패했습니다. 다시 시도해 주세요.', { id: walletToastId });
          await firebaseSignOut(auth);
          setUser(null);
          window.location.href = '/login';
          throw error;
        }
      } else {
        // Existing user login
        toast.success('로그인이 완료되었습니다!');
        window.location.href = '/';
      }
    } catch (error: any) {
      console.error("🔥 Auth Error:", error);
      toast.error(isSignUp ? '회원가입에 실패했습니다.' : '로그인에 실패했습니다.');
      window.location.href = '/login';
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
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