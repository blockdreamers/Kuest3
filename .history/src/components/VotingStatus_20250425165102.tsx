// src/pages/VotingStatus.tsx
import React, { useEffect, useState } from 'react';
import supabase from '../lib/supabase';
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
        <img src={coin.logo} alt={coin.name_ko} className="voting-coin-logo" />
        <div>
          <div className="voting-name">{coin.name_ko}</div>
          <div className="voting-symbol">{coin.symbol}</div>
        </div>
      </div>

      <div className="flex items-center space-x-8 min-w-fit">
        <div className="text-right">
          <p className="vote-stat-label">가격</p>
          <p className="vote-stat-value">₩{Math.round(coin.price).toLocaleString()}</p>
        </div>
        <div className="text-right">
          <p className="vote-stat-label">총 누적 Pick</p>
          <p className="vote-stat-value">{coin.total_pick.toLocaleString()}</p>
        </div>
        <div className="text-right">
          <p className="vote-stat-label">24시간 Pick</p>
          <p className="vote-stat-value">{coin.daily_pick.toLocaleString()}</p>
        </div>
        <div className="text-right">
          <p className="vote-stat-label">총 에어드랍 물량</p>
          <p className="vote-stat-value">{coin.total_airdrop.toLocaleString()}</p>
        </div>
        <div className="text-right">
          <p className="vote-stat-label">에어드랍 소진율</p>
          <p className="vote-stat-value">{coin.airdrop_utilization.toFixed(2)}%</p>
        </div>
        <div className="text-right">
          <p className="vote-stat-label">잔여 에어드랍</p>
          <p className="vote-stat-value">{coin.airdrop_remaining.toFixed(2)}%</p>
        </div>

        {isHovered && <button className="vote-button">투표하기</button>}
      </div>
    </div>
  );
};

const VotingStatus = () => {
  const [coins, setCoins] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const { data: votingData, error: votingError } = await supabase
        .from('voting_status')
        .select('*');

      const { data: projectData, error: projectError } = await supabase
        .from('project_info')
        .select('slug, name_ko, logo, symbol, price');

      if (votingError || projectError) {
        console.error('❌ Supabase fetch 오류:', votingError || projectError);
        return;
      }

      const merged = votingData.map((v) => ({
        ...v,
        ...(projectData.find((p) => p.slug === v.project_id) || {})
      }));

      // 투표 수로 정렬
      const sorted = merged.sort((a, b) => b.total_pick - a.total_pick);
      setCoins(sorted);
    };

    fetchData();
  }, []);

  return (
    <div className="mb-16 px-2">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-black">🗳️ 인기 투표</h1>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-4 md:p-6">
        <div className="space-y-3 max-h-[600px] overflow-y-auto">
          {coins.map((coin, index) => (
            <VotingCard key={coin.project_id} coin={coin} rank={index + 1} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default VotingStatus;
