import { toast } from 'react-hot-toast';
import { insertUserWallet } from './supabaseUser';
import { User } from 'firebase/auth';

/**
 * Privy 지갑을 연결하고 Supabase에 저장하는 함수
 */
export const connectPrivyWallet = async (
  login: () => Promise<void>,
  getWalletsFn: () => (() => Promise<{ address: string }[]>) | undefined,
  isAuthenticated: boolean,
  firebaseUser: User,
  retryDelayMs: number = 300,
  maxWaitMs: number = 60000 // 최대 대기 시간 (기본: 60초)
): Promise<{ address: string }> => {
  const toastId = 'wallet-toast';
  toast.dismiss(toastId);
  toast.loading('지갑 연결 중... 메타마스크 팝업을 확인해주세요.', { id: toastId });

  const startTime = Date.now();

  // ✅ Privy 인증이 안 되어 있다면 login 먼저 수행
  if (!isAuthenticated) {
    console.log('🔐 Privy 로그인 시도');
    await login();
  } else {
    console.log('✅ 이미 Privy 인증된 상태');
  }

  // ✅ getWallets 함수가 초기화될 때까지 대기
  let getWallets: (() => Promise<{ address: string }[]>) | undefined = undefined;
  while (!getWallets) {
    const fn = getWalletsFn();
    console.log('🧪 getWalletsFn 실행 결과:', fn);

    if (typeof fn === 'function') {
      getWallets = fn;
      console.log('✅ getWallets 초기화 완료');
      break;
    }

    // ⏱️ 무한 대기를 막기 위한 제한 시간 초과 검사
    if (Date.now() - startTime > maxWaitMs) {
      toast.dismiss(toastId);
      toast.error('지갑 연결 실패: Privy 초기화 시간 초과');
      throw new Error('Privy getWalletsFn 초기화 실패 (타임아웃)');
    }

    console.log('⏳ getWalletsFn 대기 중...');
    await new Promise((res) => setTimeout(res, retryDelayMs));
  }

  // ✅ 지갑 연결 후 Supabase 저장 시도 (무한 재시도)
  while (true) {
    try {
      const wallets = await getWallets();
      console.log('🔍 getWallets 호출 결과:', wallets);

      if (wallets && wallets.length > 0) {
        const wallet = wallets[0];
        console.log('✅ Privy 지갑 연결 성공:', wallet);
        console.log('🧪 Supabase에 저장할 지갑 정보:', {
          user_id: firebaseUser.uid,
          wallet_address: wallet.address,
        });

        await insertUserWallet({
          user_id: firebaseUser.uid,
          wallet_address: wallet.address,
          created_at: new Date().toISOString(),
        });

        toast.dismiss(toastId);
        toast.success('지갑 연결이 완료되었습니다!');
        return wallet;
      }

      console.log('⏳ 아직 지갑 연결되지 않음. 재시도 대기 중...');
    } catch (err) {
      console.error('🔥 getWallets 호출 실패:', err);
      console.warn('🔁 재시도 대기 중... Firebase user:', firebaseUser?.uid);
    }

    await new Promise((res) => setTimeout(res, retryDelayMs));
  }
};
