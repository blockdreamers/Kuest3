import React, { useEffect, useState } from 'react';
import supabase from '../lib/supabase';
import './VotingStatus.css';

type VotingData = {
  project_id: string;
  name: string;
  symbol: string;
  logo: string;
  total_pick: number;
  daily_pick: number;
  total_airdrop: number;
  airdrop_utilization: number;
  airdrop_remaining: number;
};

const VotingCard = ({ coin, rank }: { coin: VotingData; rank: number }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={`voting-card flex items-center justify-between px-4 py-2 ${isHovered ? 'hovered' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-center space-x-4 overflow-hidden">
        <div className="voting-rank">{rank}</div>
        <img src={coin.logo} alt={coin.name} className="voting-coin-logo" />
        <div>
          <div className="voting-name">{coin.name}</div>
          <div className="voting-symbol">{coin.symbol}</div>
        </div>
      </div>

      <div className="flex items-center space-x-8 min-w-fit">
        <div className="text-right">
          <p className="vote-stat-label">가격</p>
          <p className="vote-stat-value">₩{(coin.daily_pick * 100).toLocaleString()}</p>
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
          <p className="vote-stat-label">잔여 에어드랍 비율</p>
          <p className="vote-stat-value">{coin.airdrop_remaining.toFixed(2)}%</p>
        </div>
        {isHovered && <button className="vote-button">투표하기</button>}
      </div>
    </div>
  );
};

const VotingStatus = () => {
  const [votingData, setVotingData] = useState<VotingData[]>([]);

  useEffect(() => {
    const fetchVotingData = async () => {
      const { data, error } = await supabase
        .from('voting_status')
        .select(`
          project_id,
          total_pick,
          daily_pick,
          total_airdrop,
          airdrop_utilization,
          airdrop_remaining,
          project_info (
            name,
            symbol,
            logo
          )
        `)
        .eq('date', new Date().toISOString().split('T')[0]);

      if (error) {
        console.error('투표 데이터 불러오기 실패:', error.message);
        return;
      }

      const formattedData = data.map((item: any) => ({
        project_id: item.project_id,
        total_pick: item.total_pick,
        daily_pick: item.daily_pick,
        total_airdrop: item.total_airdrop,
        airdrop_utilization: item.airdrop_utilization,
        airdrop_remaining: item.airdrop_remaining,
        name: item.project_info?.name ?? '',
        symbol: item.project_info?.symbol ?? '',
        logo: item.project_info?.logo ?? '',
      }));

      setVotingData(formattedData);
    };

    fetchVotingData();
  }, []);

  return (
    <div className="mb-16 px-2">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-black">🗳️인기 투표</h1>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-4 md:p-6">
        <div className="space-y-3 max-h-[600px] overflow-y-auto">
          {votingData.map((coin, index) => (
            <VotingCard key={coin.project_id} coin={coin} rank={index + 1} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default VotingStatus;
