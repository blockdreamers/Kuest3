// src/contexts/AuthContext.tsx

import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User,
} from 'firebase/auth';
import { usePrivy } from '@privy-io/react-auth';
import toast from 'react-hot-toast';

import { auth } from '../config/firebase';
import supabase from '../lib/supabase';
import { signInWithGooglePopup } from '../lib/auth/googleAuth';
import { connectPrivyWallet } from '../lib/auth/privyWallet';
import { insertSupabaseUser, insertUserWallet } from '../lib/auth/supabaseUser';

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
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async (isSignUp: boolean) => {
    try {
      const currentUser = await signInWithGooglePopup();
      setUser(currentUser);
      console.log('✅ Firebase 로그인 성공:', currentUser);

      const isNewUser = await checkIfNewUser(currentUser.uid);
      console.log('🧾 Supabase 기준 isNewUser:', isNewUser);

      if (!isNewUser && isSignUp) {
        toast.dismiss('wallet-toast');
        toast.error('이미 가입된 사용자입니다. 로그인만 해주세요.');
        await Promise.all([
          firebaseSignOut(auth),
          privyAuthenticated ? privyLogout() : Promise.resolve(),
        ]);
        setUser(null);
        setTimeout(() => (window.location.href = '/login'), 1500);
        return;
      }

      if (isSignUp && isNewUser) {
        try {
          console.log('🔁 Privy login + wallet 연결 시도');

          const wallet = await connectPrivyWallet(
            () => privyLogin(),
            () => {
              const gw = getWallets;
              console.log('🔍 getWallets 내부 확인:', gw);
              return gw;
            },
            privyAuthenticated,
            currentUser
          );

          console.log('✅ Privy Wallet 연결됨:', wallet);

          await insertSupabaseUser({
            id: currentUser.uid,
            email: currentUser.email,
            nickname: currentUser.displayName,
            photo: currentUser.photoURL,
            user_type: 'normal',
            created_at: new Date().toISOString(),
            last_login_at: new Date().toISOString(),
            is_active: true,
          });

          await insertUserWallet({
            user_id: currentUser.uid,
            wallet_address: wallet.address,
            created_at: new Date().toISOString(),
          });

          toast.dismiss('wallet-toast');
          toast.success('회원가입이 완료되었습니다! 🎉');
          setTimeout(() => (window.location.href = '/'), 1500);
        } catch (dbError: any) {
          console.error('❌ Supabase 삽입 실패:', dbError);
          toast.dismiss('wallet-toast');
          toast.error(`회원정보 저장 실패: ${dbError.message || '알 수 없는 오류'}`);
        }
      } else {
        toast.success('로그인이 완료되었습니다!');
      }
    } catch (error: any) {
      console.error('🔥 signInWithGoogle 전체 실패:', error);
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
  try {
    const { data, error } = await supabase
      .from('users')
      .select('id')
      .eq('id', uid)
      .limit(1);
    if (error) throw new Error(`Supabase 쿼리 실패: ${error.message}`);
    return !data || data.length === 0;
  } catch (e) {
    console.error('❌ Supabase 유저 조회 중 예외 발생:', e);
    throw e;
  }
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};