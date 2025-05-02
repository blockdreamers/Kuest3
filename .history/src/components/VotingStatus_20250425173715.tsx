import React, { useEffect, useState } from 'react';
import supabase from '../lib/supabase';
import { fetchUSDKRW } from '../lib/utils/getExchangeRate';
import './VotingStatus.css';

const formatNumber = (value: number): string => {
  return value.toLocaleString();
};

const VotingCard = ({ coin, rank }: any) => {
  const [isHovered, setIsHovered] = useState(false);

  const isTop3 = rank <= 3;
  const rankBadge = isTop3 ? (
    <div className="absolute top-1 left-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full font-bold z-10">
      🔥 {rank}위
    </div>
  ) : null;

  return (
    <div
      className={`relative voting-card flex items-center justify-between px-4 py-2 ${isHovered ? 'hovered' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {rankBadge}

      <div className="flex items-center space-x-4 overflow-hidden">
        <div className="voting-rank text-gray-400 font-semibold">{rank}</div>
        <img src={coin.logo} alt={coin.name} className="w-12 h-12 rounded-full" />
        <div>
          <div className="voting-name text-lg font-semibold">{coin.name}</div>
          <div className="voting-symbol text-sm text-gray-500">{coin.symbol}</div>
        </div>
      </div>

      <div className="flex items-center space-x-8 min-w-fit">
        <div className="text-right">
          <p className="vote-stat-label">가격</p>
          <p className="vote-stat-value">{formatNumber(coin.price)} 원</p>
        </div>
        <div className="text-right">
          <p className="vote-stat-label">총 Pick</p>
          <p className="vote-stat-value">{formatNumber(coin.total_pick)}</p>
        </div>
        <div className="text-right">
          <p className="vote-stat-label">24시간 Pick</p>
          <p className="vote-stat-value">{formatNumber(coin.daily_pick)}</p>
        </div>
        <div className="text-right">
          <p className="vote-stat-label">에어드랍 총량</p>
          <p className="vote-stat-value">{formatNumber(coin.total_airdrop)}</p>
        </div>
        <div className="text-right">
          <p className="vote-stat-label">소진율</p>
          <p className="vote-stat-value">{coin.airdrop_utilization.toFixed(2)}%</p>
        </div>
        <div className="text-right">
          <p className="vote-stat-label">잔여율</p>
          <p className="vote-stat-value">{coin.airdrop_remaining.toFixed(2)}%</p>
        </div>
        {isHovered && <button className="vote-button">투표하기</button>}
      </div>
    </div>
  );
};

const VotingStatus = () => {
  const [coins, setCoins] = useState<any[]>([]);
  const [exchangeRate, setExchangeRate] = useState<number>(1350);

  useEffect(() => {
    const loadData = async () => {
      const rate = await fetchUSDKRW();
      setExchangeRate(rate);

      const { data, error } = await supabase
        .from('voting_status')
        .select(`
          project_id,
          total_pick,
          daily_pick,
          total_airdrop,
          airdrop_utilization,
          airdrop_remaining,
          date,
          project_info:project_info (
            name,
            symbol,
            logo,
            price
          )
        `);

      if (error) {
        console.error('투표 데이터 불러오기 오류:', error.message);
      } else {
        const parsed = data
          .map((item: any) => ({
            ...item.project_info,
            ...item,
            price: Math.round((item.project_info?.price || 0) * rate),
          }))
          .sort((a, b) => b.total_pick - a.total_pick); // 총 Pick 기준 정렬

        setCoins(parsed);
      }
    };

    loadData();
  }, []);

  return (
    <div className="mb-16 px-2">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-black">🗳️인기 투표</h1>
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
