import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  signInWithRedirect,
  getRedirectResult,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User
} from 'firebase/auth';
import { auth, googleProvider } from '../config/firebase';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log("🔥 Auth State Changed:", user ? "User Logged In" : "No User");
      setUser(user);
      setLoading(false);
    });

    // Handle redirect result when the page loads
    getRedirectResult(auth)
      .then((result) => {
        if (result?.user) {
          console.log("🔥 Redirect Result Success:", result.user.email);
          setUser(result.user);
        }
      })
      .catch((error) => {
        console.error("🔥 Redirect Result Error:", error);
      });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    try {
      console.log("🔥 Starting Google Sign In");
      await signInWithRedirect(auth, googleProvider);
    } catch (error: any) {
      console.error("🔥 Google Sign In Error:", error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
      setUser(null);
    } catch (error) {
      console.error("🔥 Sign Out Error:", error);
      throw error;
    }
  };

  const value = {
    user,
    loading,
    signInWithGoogle,
    signOut
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
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