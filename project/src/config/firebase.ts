import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

// Log environment variables before initialization
console.log("🔥 Environment Variables Check:", {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY ? "✅ Present" : "❌ Missing",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,  // Show actual value
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID ? "✅ Present" : "❌ Missing",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET ? "✅ Present" : "❌ Missing",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID ? "✅ Present" : "❌ Missing",
  appId: import.meta.env.VITE_FIREBASE_APP_ID ? "✅ Present" : "❌ Missing",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID ? "✅ Present" : "❌ Missing"
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

console.log("🔥 Firebase Config:", {
  ...firebaseConfig,
  authDomain: firebaseConfig.authDomain  // Explicitly log authDomain
});

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Auth with custom settings
export const auth = getAuth(app);
auth.useDeviceLanguage();

// Configure Google Auth Provider with custom settings
export const googleProvider = new GoogleAuthProvider();
googleProvider.addScope('email');
googleProvider.addScope('profile');
googleProvider.setCustomParameters({
  prompt: 'select_account',
  // Add localhost to allowed domains
  auth_domain: window.location.hostname
});