// Airdrop.tsx
import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { usePrivy } from '@privy-io/react-auth';
import AirdropAbi from '../abis/AirdropAbi.json';

const INFURA_SEPOLIA_URL = import.meta.env.VITE_INFURA_SEPOLIA_URL || '';
const AIRDROP_CONTRACT_ADDRESS = import.meta.env.VITE_AIRDROP_CONTRACT_ADDRESS || '';

const Airdrop = () => {
  const { ready, authenticated, user } = usePrivy();
  const [claimableAmount, setClaimableAmount] = useState<string | null>(null);
  const [alreadyClaimed, setAlreadyClaimed] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);

  useEffect(() => {
    if (ready && authenticated && user?.wallet?.address) {
      setWalletAddress(user.wallet.address);
    }
  }, [ready, authenticated, user]);

  useEffect(() => {
    const fetchAirdropInfo = async () => {
      if (!walletAddress) return;

      console.log('📍 지갑 주소:', walletAddress);
      console.log('📍 Infura URL:', INFURA_SEPOLIA_URL);
      console.log('📍 Airdrop Contract:', AIRDROP_CONTRACT_ADDRESS);

      try {
        setLoading(true);
        const provider = new ethers.JsonRpcProvider(INFURA_SEPOLIA_URL);
        const contract = new ethers.Contract(AIRDROP_CONTRACT_ADDRESS, AirdropAbi, provider);

        const amount = await contract.airdropAmount(walletAddress);
        const claimed = await contract.claimed(walletAddress);

        setClaimableAmount(ethers.formatUnits(amount, 18));
        setAlreadyClaimed(claimed);

        console.log('✅ 조회 성공 - 수량:', amount.toString(), ' / Claimed:', claimed);
      } catch (error: any) {
        console.error('❌ 에어드랍 조회 실패:', error.message);
        setClaimableAmount(null);
        setAlreadyClaimed(null);
      } finally {
        setLoading(false);
      }
    };

    fetchAirdropInfo();
  }, [walletAddress]);

  return (
    <div className="airdrop-page">
      <h2>Kuest Coin 에어드롭 받기</h2>

      <div className="airdrop-summary">
        <p>📍 내 지갑: {walletAddress || '지갑 연결 필요'}</p>
        <p>💰 에어드랍 수량: {claimableAmount ? `${claimableAmount} KST` : '조회 중...'}</p>
        <p>✅ 클레임 여부: {alreadyClaimed === null ? '조회 중...' : alreadyClaimed ? '이미 클레임됨' : '클레임 가능'}</p>
      </div>

      <button disabled={!claimableAmount || alreadyClaimed || loading}>
        {loading ? '조회 중...' : '🎁 Claim 하기'}
      </button>
    </div>
  );
};

export default Airdrop;
