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
    console.log("🔥 AuthProvider mounted");
    
    // Handle redirect result first
    getRedirectResult(auth)
      .then((result) => {
        if (result?.user) {
          console.log("🔥 Redirect Result Success:", {
            email: result.user.email,
            uid: result.user.uid,
            providerId: result.providerId
          });
          setUser(result.user);
        } else {
          console.log("🔥 No redirect result");
        }
      })
      .catch((error) => {
        console.error("🔥 Redirect Result Error:", {
          code: error.code,
          message: error.message,
          email: error.email,
          credential: error.credential
        });
      });

    // Then set up auth state listener
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log("🔥 Auth State Changed:", {
        loggedIn: !!user,
        email: user?.email,
        uid: user?.uid
      });
      setUser(user);
      setLoading(false);
    });

    return () => {
      console.log("🔥 Cleaning up auth listeners");
      unsubscribe();
    };
  }, []);

  const signInWithGoogle = async () => {
    try {
      console.log("🔥 Starting Google Sign In");
      await signInWithRedirect(auth, googleProvider);
    } catch (error: any) {
      console.error("🔥 Google Sign In Error:", {
        code: error.code,
        message: error.message,
        email: error.email,
        credential: error.credential
      });
      throw error;
    }
  };

  const signOut = async () => {
    try {
      console.log("🔥 Starting Sign Out");
      await firebaseSignOut(auth);
      setUser(null);
      console.log("🔥 Sign Out Successful");
    } catch (error: any) {
      console.error("🔥 Sign Out Error:", {
        code: error.code,
        message: error.message
      });
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