// src/lib/auth/privyWallet.ts

import { toast } from 'react-hot-toast';
import { PrivyClient } from '@privy-io/react-auth';

/**
 * Privy 지갑 연결을 시도하고 연결된 첫 번째 지갑 주소를 반환합니다.
 * 실패 시 최대 maxRetries만큼 재시도 후 에러를 throw합니다.
 *
 * @param privy - Privy 클라이언트 인스턴스
 * @param maxRetries - 최대 재시도 횟수 (기본값: 10)
 * @param retryDelayMs - 재시도 간격(ms) (기본값: 300)
 * @returns 연결된 지갑 주소
 */
export const connectWalletWithRetry = async (
  privy: PrivyClient,
  maxRetries: number = 10,
  retryDelayMs: number = 300
): Promise<string> => {
  toast.loading('지갑 연결 중...', { id: 'wallet-connect' });

  try {
    await privy.login();

    for (let i = 0; i < maxRetries; i++) {
      const wallets = await privy.getWallets();
      console.log(`🔁 Wallet Retry ${i + 1}:`, wallets);

      if (wallets.length > 0) {
        const walletAddress = wallets[0].address;
        toast.success('지갑 연결 성공', { id: 'wallet-connect' });
        return walletAddress;
      }

      await new Promise((res) => setTimeout(res, retryDelayMs));
    }

    toast.error('지갑 연결 실패: 연결된 지갑이 없습니다.', { id: 'wallet-connect' });
    throw new Error('연결된 지갑이 없습니다.');
  } catch (error) {
    console.error('❌ Privy 지갑 연결 에러:', error);
    toast.error('지갑 연결 중 문제가 발생했습니다.', { id: 'wallet-connect' });
    throw error;
  }
};
