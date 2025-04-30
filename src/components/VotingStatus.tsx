// src/pages/VotingStatus.tsx
import React, { useEffect, useState } from 'react';
import supabase from '../lib/supabase';
import { fetchUSDKRW } from '../lib/utils/getExchangeRate';
import './VotingStatus.css'; // voting-scroll 적용

const formatNumber = (value: number): string => {
  return value.toLocaleString();
};

const formatKRW = (value: number): string => {
  if (value < 10) {
    return `${value.toFixed(2)} 원`;
  }
  return `${Math.round(value).toLocaleString()} 원`;
};

const getFireBadgeColor = (rank: number): string => {
  const colors = [
    'bg-red-600', 'bg-red-500', 'bg-red-400', 'bg-red-300', 'bg-red-200',
  ];
  return colors[rank - 1] || '';
};

const ProgressBar = ({ percent, isHovered }: { percent: number; isHovered: boolean }) => (
  <div className="w-24 h-2 rounded-full overflow-hidden bg-white hover:bg-black transition-colors duration-300">
    <div
      className="h-full transition-all duration-300"
      style={{
        width: `${percent}%`,
        backgroundColor: isHovered ? '#FFFFFF' : '#C7EB3E',
      }}
    />
  </div>
);

const VotingCard = ({ coin, rank }: any) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={`voting-card flex items-center justify-between px-4 py-2 ${isHovered ? 'hovered' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-center space-x-4 overflow-hidden">
        <div className={`flex items-center justify-center w-10 h-10 rounded-full text-white font-bold text-xs ${getFireBadgeColor(rank)}`}>
          {rank <= 5 ? <>🔥 {rank}위</> : <>{rank}</>}
        </div>
        <img src={coin.logo} alt={coin.name_ko} className="voting-coin-logo w-12 h-12" />
        <div className={`transition-colors duration-300 ${isHovered ? 'text-black' : 'text-white'}`}>
          <div className="text-sm">{coin.name_ko}</div>
          <div className="text-xs text-gray-400">{coin.symbol}</div>
        </div>
      </div>

      <div className="flex items-center space-x-6 min-w-fit">
        <div className="text-right">
          <p className="vote-stat-label">가격</p>
          <p className="vote-stat-value">{formatKRW(coin.price)}</p>
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
          <p className="vote-stat-label">에어드랍</p>
          <p className="vote-stat-value">{formatNumber(coin.total_airdrop)}</p>
        </div>
        <div className="text-right">
          <p className="vote-stat-label">잔여율</p>
          <ProgressBar percent={coin.airdrop_remaining} isHovered={isHovered} />
        </div>
        {isHovered && (
          <button className="vote-button transition-transform hover:scale-95">
            투표하기
          </button>
        )}
      </div>
    </div>
  );
};

const VotingStatus = () => {
  const [coins, setCoins] = useState<any[]>([]);
  const [exchangeRate, setExchangeRate] = useState<number>(1350);
  const [selectedSeason, setSelectedSeason] = useState<string>('1');

  useEffect(() => {
    const loadData = async () => {
      const rate = await fetchUSDKRW();
      setExchangeRate(rate);

      const { data, error } = await supabase
        .from('voting_season_status')
        .select(`
          project_id,
          season,
          total_pick,
          daily_pick,
          total_airdrop,
          airdrop_utilization,
          airdrop_remaining,
          date,
          project_info:project_info (
            name_ko,
            symbol,
            logo,
            price
          )
        `)
        .order('total_pick', { ascending: false });

      if (error) {
        console.error('투표 데이터 불러오기 오류:', error.message);
      } else {
        const parsed = data.map((item: any) => ({
          ...item.project_info,
          ...item,
          name_ko: item.project_info?.name_ko ? JSON.parse(`"${item.project_info.name_ko}"`) : '',
          price: Math.round((item.project_info?.price || 0) * rate),
        }));
        setCoins(parsed);
      }
    };

    loadData();
  }, []);

  const handleSeasonChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedSeason(e.target.value);
  };

  const filteredCoins = coins.filter((coin) => String(coin.season) === selectedSeason);


  return (
    <div className="mb-16 px-2">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">🗳️인기 투표</h1>
        <select
          value={selectedSeason}
          onChange={handleSeasonChange}
          className="ml-4 px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#C7EB3E]"
        >
          <option value="1">시즌 1</option>
          <option value="2">시즌 2</option>
          <option value="3">시즌 3</option>
        </select>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-4 md:p-6">
        {/* ✨ 여기 voting-scroll 클래스 적용 */}
        <div className="voting-scroll space-y-3">
          {filteredCoins.map((coin, index) => (
            <VotingCard key={`${coin.project_id}-${coin.season}`} coin={coin} rank={index + 1} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default VotingStatus;
