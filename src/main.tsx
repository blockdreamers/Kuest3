// main.tsx
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
      onSuccess={async (user, context) => {
        console.log('✅ [Privy] onSuccess triggered');
        console.log('👤 User:', user);
        console.log('📦 Context:', context);
        try {
          const wallets = await user.getWallets();
          console.log('💼 Wallets:', wallets);
          if (wallets.length > 0) {
            console.log('✅ [Privy] 지갑 주소 확보됨:', wallets[0].address);
          } else {
            console.warn('❌ [Privy] 지갑 없음');
          }
        } catch (err) {
          console.error('❌ [Privy] wallet fetch 실패:', err);
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
