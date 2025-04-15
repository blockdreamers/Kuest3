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
    <PrivyProvider appId={PRIVY_APP_ID} config={{ appearance: { theme: 'light' } }}>
      <AuthProvider>
        <Router>
          <App />
          <Toaster position="top-right" />
        </Router>
      </AuthProvider>
    </PrivyProvider>
  </StrictMode>
);