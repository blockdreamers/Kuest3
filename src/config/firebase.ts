import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

// Log environment variables before initialization
console.log("🔥 Firebase Environment Check:", {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY ? "✅" : "❌",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID ? "✅" : "❌",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET ? "✅" : "❌",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID ? "✅" : "❌",
  appId: import.meta.env.VITE_FIREBASE_APP_ID ? "✅" : "❌",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID ? "✅" : "❌"
});

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Auth
export const auth = getAuth(app);
auth.useDeviceLanguage();

// Configure Google Auth Provider
export const googleProvider = new GoogleAuthProvider();
googleProvider.addScope('email');
googleProvider.addScope('profile');
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

// Log initialization status
console.log("🔥 Firebase Initialized:", {
  appName: app.name,
  authDomain: firebaseConfig.authDomain, // Now directly outputting firebaseConfig.authDomain
  currentUser: auth.currentUser ? "Logged In" : "Not Logged In"
});