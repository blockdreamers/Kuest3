import React, { useEffect, useState } from 'react';
import { usePrivy } from '@privy-io/react-auth';
import { ethers } from 'ethers';
import './Airdrop.css';
import AirdropAbi from '../abis/AirdropClaim.json';

const AIRDROP_CONTRACT_ADDRESS = '0x83f954578bc8B4732E1957a439dB1Cb60A47Fc5A';

const Airdrop = () => {
  const { ready, authenticated, user, login, logout } = usePrivy();

  const [userBalance, setUserBalance] = useState(0);
  const [claimableAmount, setClaimableAmount] = useState(0);
  const [claiming, setClaiming] = useState(false);

  const airdropTotal = 999_999_999;
  const claimedAmount = 324_580_000;
  const remainingAmount = airdropTotal - claimedAmount;
  const progress = (claimedAmount / airdropTotal) * 100;

  const getProvider = (): ethers.providers.Web3Provider | null => {
    if (typeof window !== 'undefined' && window.ethereum) {
      return new ethers.providers.Web3Provider(window.ethereum);
    }
    console.warn('🛑 MetaMask가 감지되지 않았습니다.');
    return null;
  };

  const fetchAirdropInfo = async () => {
    try {
      if (!authenticated || !user?.wallet?.address) {
        console.warn('❌ 인증 안 됨 or 지갑 없음');
        return;
      }

      const provider = getProvider();
      if (!provider) return;

      await provider.send("eth_requestAccounts", []); // MetaMask 연결 요청

      const signer = provider.getSigner();
      const address = await signer.getAddress();
      console.log('🔐 MetaMask 주소:', address);

      const contract = new ethers.Contract(AIRDROP_CONTRACT_ADDRESS, AirdropAbi, provider);
      const amount = await contract.airdropAmount(address);
      const claimed = await contract.claimed(address);

      console.log('💰 조회된 에어드랍 수량:', amount.toString());
      console.log('✅ Claimed 여부:', claimed);

      const amountFormatted = Number(ethers.utils.formatUnits(amount, 18));
      setUserBalance(amountFormatted);
      setClaimableAmount(claimed ? 0 : amountFormatted);
    } catch (err) {
      console.error('📛 에어드랍 조회 실패:', err);
      alert('에어드랍 정보를 불러오는 데 실패했습니다.');
    }
  };

  useEffect(() => {
    if (ready && authenticated) {
      fetchAirdropInfo();
    }
  }, [ready, authenticated]);

  const handleClaim = async () => {
    try {
      setClaiming(true);

      const provider = getProvider();
      if (!provider) throw new Error('MetaMask provider not available');

      const signer = provider.getSigner();
      const contract = new ethers.Contract(AIRDROP_CONTRACT_ADDRESS, AirdropAbi, signer);

      const tx = await contract.claim();
      await tx.wait();

      alert('✅ 클레임 성공!');
      setClaimableAmount(0);
    } catch (err) {
      console.error('📛 클레임 실패:', err);
      alert('클레임 중 오류가 발생했습니다.');
    } finally {
      setClaiming(false);
    }
  };

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
          <div
            className="absolute top-0 left-0 h-4 bg-[#C7EB3E]"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="mt-8">
        {!authenticated ? (
          <button
            onClick={login}
            className="w-full py-3 rounded-lg bg-black text-white font-semibold text-lg hover:bg-gray-900 transition"
          >
            🔐 Privy 로그인 (MetaMask 사용)
          </button>
        ) : (
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
            <button
              onClick={logout}
              className="text-sm text-gray-500 underline hover:text-black"
            >
              지갑 연결 해제
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Airdrop;
