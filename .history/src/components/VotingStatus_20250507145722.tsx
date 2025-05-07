// src/pages/VotingStatus.tsx
import React, { useEffect, useState } from 'react';
import supabase from '../lib/supabase';
import { fetchUSDKRW } from '../lib/utils/getExchangeRate';
import './VotingStatus.css';

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

      if (!error && data) {
        const parsed = data.map((item: any) => ({
          ...item.project_info,
          ...item,
          name_ko: item.project_info?.name_ko ? JSON.parse(`"${item.project_info.name_ko}"`) : '',
          price: Math.round((item.project_info?.price || 0) * rate),
        }));
        setCoins(parsed);
      } else {
        console.error('투표 데이터 불러오기 오류:', error?.message);
      }
    };

    loadData();
  }, []);

  const handleSeasonChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedSeason(e.target.value);
  };

  const filteredCoins = coins.filter((coin) => String(coin.season) === selectedSeason).slice(0, 10);

  const pyramidLayout = [
    [0],
    [1, 2],
    [3, 4, 5],
    [6, 7, 8, 9],
  ];

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

      <div className="flex flex-col items-center space-y-6">
        {pyramidLayout.map((row, rowIndex) => (
          <div key={rowIndex} className="flex justify-center gap-6">
            {row.map((index) => {
              const coin = filteredCoins[index];
              if (!coin) return null;
              return (
                <div
                  key={coin.project_id}
                  className="voting-card pyramid-card"
                >
                  <div className="flex items-center">
                    <div className="text-sm font-bold text-gray-300 mr-2">{index + 1}위</div>
                    <img src={coin.logo} alt={coin.name_ko} className="w-12 h-12 rounded-full mr-3" />
                  </div>
                  <div className="flex flex-col items-start">
                    <div className="text-base font-semibold voting-name">{coin.name_ko}</div>
                    <div className="text-xs voting-symbol">{coin.symbol}</div>
                    <div className="text-sm font-bold text-orange-400 mt-1">{coin.total_pick.toLocaleString()} 표</div>
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

export default VotingStatus;
