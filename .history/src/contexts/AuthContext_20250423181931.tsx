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
import { insertSupabaseUser } from '../lib/auth/supabaseUser';

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
    authenticated: privyAuthenticated,
    logout: privyLogout,
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
      console.log('🧾
