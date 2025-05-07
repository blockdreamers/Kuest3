import React, { useState } from 'react';
import { votingInfo } from '../lib/data/votingInfo'; // 실제 데이터는 이곳에서 가져옵니다.
import './VotingStatus.css';

const VotingCard = ({ coin, rank }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={`voting-card flex items-center justify-between px-4 py-2 ${isHovered ? 'hovered' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-center space-x-4 overflow-hidden">
        <div className="voting-rank">{rank}</div>
        <img
          src={coin.logo}
          alt={coin.name}
          className="voting-coin-logo"
        />
        <div>
          <div className="voting-name">{coin.name}</div>
          <div className="voting-symbol">{coin.symbol}</div>
        </div>
      </div>

      <div className="flex items-center space-x-8 min-w-fit">
        <div className="text-right">
          <p className="vote-stat-label">가격</p>
          <p className="vote-stat-value">${(coin.votes / 100).toFixed(2)}</p>
        </div>
        <div className="text-right">
          <p className="vote-stat-label">총 누적 Pick</p>
          <p className="vote-stat-value">{coin.totalPick.toLocaleString()}</p>
        </div>
        <div className="text-right">
          <p className="vote-stat-label">24시간 Pick</p>
          <p className="vote-stat-value">{coin.dailyPick.toLocaleString()}</p>
        </div>
        <div className="text-right">
          <p className="vote-stat-label">총 에어드랍 물량</p>
          <p className="vote-stat-value">{coin.totalAirdrop.toLocaleString()}</p>
        </div>
        <div className="text-right">
          <p className="vote-stat-label">에어드랍 소진율</p>
          <p className="vote-stat-value">{coin.airdropUtilization}%</p>
        </div>
        <div className="text-right">
          <p className="vote-stat-label">잔여 에어드랍 비율</p>
          <p className="vote-stat-value">{coin.airdropRemaining}%</p>
        </div>
        {isHovered && <button className="vote-button">투표하기</button>}
      </div>
    </div>
  );
};

const VotingStatus = () => {
  return (
    <div className="mb-16 px-2">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-black">🗳️인기 투표</h1>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-4 md:p-6">
        <div className="space-y-3 max-h-[600px] overflow-y-auto">
          {votingInfo.slice(0, 10).map((coin, index) => (
            <VotingCard key={coin.id} coin={coin} rank={index + 1} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default VotingStatus;
