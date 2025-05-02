import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { AuthProvider } from './contexts/AuthContext';
import { BrowserRouter as Router } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { PrivyProvider } from '@privy-io/react-auth';

const PRIVY_APP_ID = 'cm9uph3hy01eol20mdoyg7d0v';

console.log('✅ PrivyProvider loaded'); // ✅ Provider 마운트 여부 확인용 로그

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <PrivyProvider
      appId={PRIVY_APP_ID}
      config={{
        appearance: { theme: 'dark' },
        loginMethods: ['wallet'], // ✅ 외부지갑만 허용
        embeddedWallets: {
          createOnLogin: false,   // ✅ embedded wallet 완전 비활성화
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
