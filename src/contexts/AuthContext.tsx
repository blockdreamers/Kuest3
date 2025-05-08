import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User,
} from 'firebase/auth';
import { usePrivy } from '@privy-io/react-auth';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

import { auth } from '../config/firebase';
import { signInWithGooglePopup } from '../lib/auth/googleAuth';
import { insertSupabaseUser } from '../lib/auth/supabaseUser';
import { createClient } from '@supabase/supabase-js';

// Supabase 클라이언트 생성
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL!;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// ✨ ExtendedUser 타입
interface ExtendedUser extends User {
  user_type?: string;
}

interface AuthContextType {
  user: ExtendedUser | null;
  loading: boolean;
  signInWithGoogle: (isSignUp: boolean) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<ExtendedUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [authProcessed, setAuthProcessed] = useState(false);

  const navigate = useNavigate();
  const { authenticated: privyAuthenticated, logout: privyLogout } = usePrivy();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          let token = await firebaseUser.getIdToken();
          if (!token) {
            console.warn('❗ 토큰이 비어있음. 강제 재발급 시도');
            token = await firebaseUser.getIdToken(true);
          }

          const response = await fetch('/.netlify/functions/userType', {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (response.ok) {
            const { user_type } = await response.json();
            setUser({ ...firebaseUser, user_type });
          } else {
            const errorText = await response.text();
            console.warn('❓ userType 호출 실패, fallback', response.status, errorText);
            setUser(firebaseUser);
          }
        } catch (error) {
          console.error('🔥 user_type 조회 에러:', error);
          setUser(firebaseUser);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async (isSignUp: boolean) => {
    if (authProcessed) return;
    setAuthProcessed(true);

    try {
      const currentUser = await signInWithGooglePopup();
      console.log('✅ Firebase 로그인 성공:', currentUser);

      const isNewUser = await checkIfNewUser(currentUser.uid);
      console.log('🧾 Supabase 기준 isNewUser:', isNewUser);

      if (isSignUp && isNewUser) {
        await insertSupabaseUser({
          id: currentUser.uid,
          email: currentUser.email || '',
          nickname: currentUser.displayName || '',
          photo: currentUser.photoURL || '',
          user_type: 'normal',
          created_at: new Date().toISOString(),
          last_login_at: new Date().toISOString(),
          is_active: true,
        });
        toast.success('회원가입 완료! 🎉');
      } else if (!isSignUp && isNewUser) {
        await insertSupabaseUser({
          id: currentUser.uid,
          email: currentUser.email || '',
          nickname: currentUser.displayName || '',
          photo: currentUser.photoURL || '',
          user_type: 'normal',
          created_at: new Date().toISOString(),
          last_login_at: new Date().toISOString(),
          is_active: true,
        });
        toast.success('로그인 완료! 🎉');
      } else {
        await supabase
          .from('users')
          .update({ last_login_at: new Date().toISOString() })
          .eq('id', currentUser.uid);
        toast.success('로그인 완료!');
      }

      navigate('/');
    } catch (error: any) {
      console.error('🔥 signInWithGoogle 실패:', error);
      toast.error(`로그인 실패: ${error.message || '알 수 없는 오류'}`);
      await firebaseSignOut(auth);
      setUser(null);
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
      console.error('🔥 로그아웃 실패:', error);
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
  const { data, error } = await supabase
    .from('users')
    .select('id')
    .eq('id', uid)
    .maybeSingle();

  if (error) throw new Error(`Supabase 쿼리 실패: ${error.message}`);
  return !data;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
