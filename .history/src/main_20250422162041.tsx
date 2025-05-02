import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { AuthProvider } from './contexts/AuthContext';
import { BrowserRouter as Router } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { PrivyProvider } from '@privy-io/react-auth';

const PRIVY_APP_ID = 'clw5p039n0b4lhw5umwm163ua';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <PrivyProvider
      appId={PRIVY_APP_ID}
      config={{
        appearance: { theme: 'light' },
        embeddedWallets: {
          createOnLogin: false, // ✅ 요거만 바꾸면 돼!
        },
      }}
      onSuccess={(user, context) => {
        console.log('✅ [Privy] onSuccess triggered');
        console.log('👤 User:', user);
        console.log('📦 Context:', context);
      }}
      onError={(error) => {
        console.error('❌ [Privy] onError 발생:', error);
      }}
    >
      <Router>
        <AuthProvider>
          <App />
          <Toaster position="top-right" />
        </AuthProvider>
      </Router>
    </PrivyProvider>
  </StrictMode>
);
