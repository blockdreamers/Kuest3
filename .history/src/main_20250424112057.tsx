import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { AuthProvider } from './contexts/AuthContext';
import { BrowserRouter as Router } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { PrivyProvider } from '@privy-io/react-auth';

const PRIVY_APP_ID = 'cm9uph3hy01eol20mdoyg7d0v';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <PrivyProvider
      appId={PRIVY_APP_ID}
      config={{
        appearance: { theme: 'dark' },
        loginMethods: ['wallet'],
        embeddedWallets: { createOnLogin: false },
      }}
      onSuccess={(user, context) => {
        console.log('✅ [Privy] onSuccess triggered');
        console.log('👤 User:', user);
        console.log('📦 Context:', context);
        
        const walletAddress = user?.wallet?.walletAddress;
        if (walletAddress) {
          console.log('✅ [Privy] 지갑 주소 확보됨:', walletAddress);
        } else {
          console.warn('❌ [Privy] 지갑 주소 없음 (wallet object 미정의)');
        }
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
