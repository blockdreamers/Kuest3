import { toast } from 'react-hot-toast';

/**
 * Privy 지갑 연결을 시도하고 연결된 첫 번째 지갑 주소를 반환합니다.
 * 실패 시 최대 maxRetries만큼 재시도 후 에러를 throw합니다.
 *
 * @param login - Privy 로그인 함수
 * @param getWallets - 연결된 지갑을 가져오는 함수
 * @param maxRetries - 최대 재시도 횟수 (기본값: 10)
 * @param retryDelayMs - 재시도 간격(ms) (기본값: 300)
 * @returns 연결된 지갑 주소
 */
export const connectPrivyWallet = async (
  login: () => Promise<void>,
  getWallets: () => Promise<{ address: string }[]>,
  maxRetries: number = 10,
  retryDelayMs: number = 300
): Promise<{ address: string }> => {
  toast.loading('지갑 연결 중...', { id: 'wallet-connect' });

  await login();

  for (let i = 0; i < maxRetries; i++) {
    const wallets = await getWallets();
    console.log(`🔁 Wallet Retry ${i + 1}:`, wallets);
    if (wallets.length > 0) {
      toast.success('지갑 연결 성공', { id: 'wallet-connect' });
      return wallets[0]; // 지갑 객체 전체 반환
    }
    await new Promise((res) => setTimeout(res, retryDelayMs));
  }

  toast.error('지갑 연결 실패: 연결된 지갑이 없습니다.', { id: 'wallet-connect' });
  throw new Error('연결된 지갑이 없습니다.');
};
