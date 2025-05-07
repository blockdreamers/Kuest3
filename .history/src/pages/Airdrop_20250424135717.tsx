// src/pages/Airdrop.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ethers } from 'ethers';
import { useAuth } from '../contexts/AuthContext';
import { usePrivy } from '@privy-io/react-auth';
import AirdropAbi from '../abis/AirdropClaim.json';
import './Airdrop.css';

const AIRDROP_CONTRACT_ADDRESS = '0x85b1a621e4c46a9c59e5c1f2ca7245244ad3fb8'; // 본인 컨트랙트 주소

const Airdrop = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { user: privyUser, ready: privyReady, login } = usePrivy();

  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [userBalance, setUserBalance] = useState(0);
  const [claimableAmount, setClaimableAmount] = useState(0);
  const [claiming, setClaiming] = useState(false);

  const airdropTotal = 999_999_999;
  const claimedAmount = 324_580_000;
  const remainingAmount = airdropTotal - claimedAmount;
  const progress = (claimedAmount / airdropTotal) * 100;

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  // Privy에서 wallet 주소 받아오기
  useEffect(() => {
    if (privyReady && privyUser?.wallet?.address) {
      console.log('✅ [Privy] 지갑 주소:', privyUser.wallet.address);
      setWalletAddress(privyUser.wallet.address);
    } else {
      console.log('❌ [Privy] 지갑 주소 없음');
    }
  }, [privyUser, privyReady]);

  // Infura로 Contract 읽기 전용 연결
  const getInfuraProvider = () => {
    const infuraId = import.meta.env.VITE_INFURA_PROJECT_ID;
    return new ethers.providers.JsonRpcProvider(`https://sepolia.infura.io/v3/${infuraId}`);
  };

  const fetchAirdropInfo = async () => {
    if (!walletAddress) {
      console.warn('⚠️ 지갑 주소 없음');
      return;
    }

    try {
      const provider = getInfuraProvider();
      const contract = new ethers.Contract(AIRDROP_CONTRACT_ADDRESS, AirdropAbi, provider);

      console.log('🔍 Airdrop 조회 요청:', walletAddress);

      const amount = await contract.airdropAmount(walletAddress);
      const claimed = await contract.claimed(walletAddress);

      const amountFormatted = Number(ethers.utils.formatUnits(amount, 18));
      console.log('🪙 airdropAmount:', amountFormatted);
      console.log('🧾 claimed:', claimed);

      setUserBalance(amountFormatted);
      setClaimableAmount(claimed ? 0 : amountFormatted);
    } catch (err) {
      console.error('📛 에어드랍 정보 조회 실패:', err);
    }
  };

  const handleClaim = async () => {
    try {
      setClaiming(true);
      const provider = new ethers.providers.Web3Provider((window as any).ethereum);
      await provider.send('eth_requestAccounts', []);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(AIRDROP_CONTRACT_ADDRESS, AirdropAbi, signer);

      const tx = await contract.claim();
      await tx.wait();
      alert('✅ 클레임 완료!');
      setClaimableAmount(0);
    } catch (err) {
      console.error('📛 클레임 실패:', err);
      alert('클레임 중 오류 발생');
    } finally {
      setClaiming(false);
    }
  };

  useEffect(() => {
    if (walletAddress) {
      fetchAirdropInfo();
    }
  }, [walletAddress]);

  return (
    <div className="airdrop-page max-w-xl mx-auto px-6 py-12 font-['Montserrat','Pretendard'] text-black">
      <div className="flex items-center space-x-3 mb-6">
        <img
          src="https://raw.githubusercontent.com/blockdreamers/Kuest3/main/ChatGPT%20Image%20Apr%209%2C%202025%2C%2004_44_33%20PM%201.png"
          alt="Kuest Coin"
          className="w-10 h-10"
        />
        <h1 className="text-2xl font-bold">Kuest Coin 에어드롭 받기</h1>
      </div>

      <div className="bg-white rounded-lg border border-gray-300 shadow p-4 space-y-4">
        <div>
          <p className="text-sm text-gray-500">총 에어드랍 수량</p>
          <p className="text-xl font-bold text-gray-800">{airdropTotal.toLocaleString()} KST</p>
        </div>
        <div className="flex justify-between text-sm text-gray-600">
          <span>실제 총 지급</span>
          <span>{claimedAmount.toLocaleString()} / {airdropTotal.toLocaleString()}</span>
        </div>
        <div className="flex justify-between text-sm text-gray-600">
          <span>총 잔여 수량</span>
          <span>{remainingAmount.toLocaleString()} / {airdropTotal.toLocaleString()} KST</span>
        </div>

        <div className="relative w-full h-4 bg-gray-200 rounded-full overflow-hidden mt-2">
          <div className="absolute top-0 left-0 h-4 bg-[#C7EB3E]" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <div className="mt-8">
        <div className="bg-white rounded-lg border border-gray-300 shadow p-6 mt-2 space-y-4 text-black">
          <div className="flex justify-between text-lg font-semibold">
            <span>나의 에어드랍 수량</span>
            <span>{userBalance.toLocaleString()} KST</span>
          </div>
          <div className="flex justify-between text-lg font-semibold">
            <span>클레임 가능 수량</span>
            <span>{claimableAmount.toLocaleString()} KST</span>
          </div>
          <button
            onClick={handleClaim}
            disabled={claiming || claimableAmount === 0}
            className="w-full py-3 mt-4 rounded-lg bg-black text-white font-semibold text-lg hover:bg-gray-900 transition flex items-center justify-center space-x-2"
          >
            🪙 <span>{claiming ? 'Claim 중...' : 'Claim 하기'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Airdrop;
