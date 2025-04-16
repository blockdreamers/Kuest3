// lib/auth/privyWallet.ts

import { toast } from 'react-hot-toast';
import { PrivyClient } from '@privy-io/react-auth';

export const connectWalletWithRetry = async (
  privy: PrivyClient,
  maxRetries: number = 10,
  retryDelayMs: number = 300
): Promise<string> => {
  toast.loading('지갑 연결 중...', { id: 'wallet-connect' });

  await privy.login();

  for (let i = 0; i < maxRetries; i++) {
    const wallets = await privy.getWallets();
    console.log(`🔁 Wallet Retry ${i + 1}:`, wallets);
    if (wallets.length > 0) {
      toast.success('지갑 연결 성공', { id: 'wallet-connect' });
      return wallets[0].address;
    }
    await new Promise((res) => setTimeout(res, retryDelayMs));
  }

  toast.error('지갑 연결 실패: 연결된 지갑이 없습니다.', { id: 'wallet-connect' });
  throw new Error('연결된 지갑이 없습니다.');
};
