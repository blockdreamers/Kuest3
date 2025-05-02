import React, { useState } from 'react';
import './Airdrop.css';

const Airdrop = () => {
  const [walletConnected, setWalletConnected] = useState(false);
  const airdropTotal = 999_999_999;
  const claimedAmount = 324_580_000;
  const remainingAmount = airdropTotal - claimedAmount;
  const claimable = 1249;
  const userBalance = 3021;
  const progress = (claimedAmount / airdropTotal) * 100;

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
        {!walletConnected ? (
          <button
            onClick={() => setWalletConnected(true)}
            className="w-full py-3 rounded-lg bg-black text-white font-semibold text-lg hover:bg-gray-900 transition"
          >
            🔐 Privy Wallet 지갑 연결
          </button>
        ) : (
          <div className="bg-white rounded-lg border border-gray-300 shadow p-6 mt-2 space-y-4 text-black">
            <div className="flex justify-between text-lg font-semibold">
              <span>나의 에어드랍 수량</span>
              <span>{userBalance.toLocaleString()} KST</span>
            </div>
            <div className="flex justify-between text-lg font-semibold">
              <span>클레임 가능 수량</span>
              <span>{claimable.toLocaleString()} KST</span>
            </div>
            <button
              className="w-full py-3 mt-4 rounded-lg bg-black text-white font-semibold text-lg hover:bg-gray-900 transition flex items-center justify-center space-x-2"
            >
              🪙 <span>Claim 하기</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Airdrop;
