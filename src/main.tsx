// main.tsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { AuthProvider } from './contexts/AuthContext';
import { BrowserRouter as Router } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { PrivyProvider } from '@privy-io/react-auth';
import "./lib/utils/debug";


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
        console.log('👤 user:', user);
        console.log('📦 context:', context);

        try {
          console.log('🔍 user.wallet:', user?.wallet);
          const walletAddr = user?.wallet?.walletAddress;
          if (walletAddr) {
            console.log('✅ [main.tsx] user.wallet.walletAddress:', walletAddr);
          } else {
            console.warn('❌ [main.tsx] user.wallet.walletAddress 없음');
          }

          if (typeof user.getWallets === 'function') {
            const wallets = await user.getWallets();
            console.log('🧾 [main.tsx] user.getWallets():', wallets);
            if (wallets?.[0]?.address) {
              console.log('✅ [main.tsx] getWallets 첫 주소:', wallets[0].address);
            } else {
              console.warn('⚠️ [main.tsx] getWallets 결과에 주소 없음');
            }
          } else {
            console.warn('⚠️ [main.tsx] getWallets 함수가 없음 (함수 미정의)');
          }
        } catch (err) {
          console.error('❌ [main.tsx] wallet 정보 디버깅 중 오류:', err);
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
