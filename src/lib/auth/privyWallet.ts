import { toast } from 'react-hot-toast';
import { User } from 'firebase/auth';

export const connectPrivyWallet = async (
  login: () => Promise<void>,
  privyUserGetter: () => any,
  isAuthenticated: boolean,
  firebaseUser: User,
  retryDelayMs: number = 800,
  maxWaitMs: number = 70000
): Promise<{ address: string }> => {
  console.warn('🛑 connectPrivyWallet은 현재 비활성화 상태입니다.');
  toast.dismiss();
  toast('지갑 연결 기능은 현재 비활성화되어 있습니다.', { icon: '🚫' });

  return Promise.resolve({ address: '' });

  /*
  // 👇 아래 로직은 필요 시 다시 활성화 가능

  const toastId = 'wallet-toast';
  toast.dismiss(toastId);
  toast.loading('지갑 연결 중... 메타마스크 팝업을 확인해주세요.', { id: toastId });

  const startTime = Date.now();

  if (!isAuthenticated) {
    console.log('🔐 Privy 로그인 시도');
    try {
      await login();
    } catch (err) {
      toast.dismiss(toastId);
      toast.error('Privy 로그인 실패');
      throw new Error('Privy 로그인 중 오류 발생');
    }
  } else {
    console.log('✅ 이미 Privy 인증된 상태');
  }

  console.log('📡 지갑 주소 polling 시작');
  let lastLogTime = 0;

  while (true) {
    const privyUser = privyUserGetter();
    const wallet = privyUser?.wallet;

    if (wallet?.walletAddress) {
      console.log('✅ 지갑 주소 확인됨:', wallet.walletAddress);
      toast.dismiss(toastId);
      toast.success('지갑 연결이 완료되었습니다!');
      return { address: wallet.walletAddress };
    }

    const now = Date.now();
    if (now - lastLogTime > 3000) {
      console.log('⏳ 아직 지갑 주소 미확인 상태... polling 중...');
      lastLogTime = now;
    }

    if (now - startTime > maxWaitMs) {
      toast.dismiss(toastId);
      toast.error('지갑 연결 실패: 지갑 주소를 가져오지 못했습니다.');
      throw new Error('❌ Privy 유저 객체에서 walletAddress를 찾을 수 없습니다.');
    }

    await new Promise((res) => setTimeout(res, retryDelayMs));
  }
  */
};