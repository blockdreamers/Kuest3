import React, { useEffect, useState } from 'react';
import supabase from '../lib/supabase';
import { fetchUSDKRW } from '../lib/utils/getExchangeRate';
import './VotingStatus.css';

interface Season {
  season_number: number;
  name: string;
  start_at: string;
  end_at: string;
}

const VotingStatus = () => {
  const [coins, setCoins] = useState<any[]>([]);
  const [seasons, setSeasons] = useState<Season[]>([]);
  const [exchangeRate, setExchangeRate] = useState<number>(1350);
  const [selectedSeason, setSelectedSeason] = useState<string>('1');
  const [currentTime, setCurrentTime] = useState<Date>(new Date());

  useEffect(() => {
    const loadData = async () => {
      const rate = await fetchUSDKRW();
      setExchangeRate(rate);

      const [{ data: voteData }, { data: seasonData }] = await Promise.all([
        supabase
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
          .order('total_pick', { ascending: false }),
        supabase
          .from('voting_seasons')
          .select('*')
          .order('season_number', { ascending: true }),
      ]);

      if (voteData) {
        const parsed = voteData.map((item: any) => ({
          ...item.project_info,
          ...item,
          name_ko: item.project_info?.name_ko ? JSON.parse(`"${item.project_info.name_ko}"`) : '',
          price: Math.round((item.project_info?.price || 0) * rate),
        }));
        setCoins(parsed);
      }

      if (seasonData) setSeasons(seasonData);
    };

    loadData();
    const interval = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (ms: number) => {
    const sec = Math.floor(ms / 1000);
    const days = Math.floor(sec / 86400);
    const hours = Math.floor((sec % 86400) / 3600);
    const minutes = Math.floor((sec % 3600) / 60);
    const seconds = sec % 60;
    return `${days}일 ${hours}시간 ${minutes}분 ${seconds}초`;
  };

  const renderTimer = () => {
    const season = seasons.find((s) => String(s.season_number) === selectedSeason);
    if (!season) return null;

    const now = currentTime.getTime();
    const start = new Date(season.start_at).getTime();
    const end = new Date(season.end_at).getTime();

    if (now < start) return `시작까지 ${formatTime(start - now)}`;
    else if (now < end) return `종료까지 ${formatTime(end - now)}`;
    else return '종료된 시즌입니다.';
  };

  const handleSeasonChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedSeason(e.target.value);
  };

  const filteredCoins = coins
    .filter((coin) => String(coin.season) === selectedSeason)
    .slice(0, 10);

  const pyramidLayout = [
    [0],
    [1, 2],
    [3, 4, 5],
    [6, 7, 8, 9],
  ];

  return (
    <div className="mb-16 px-2">
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-2xl font-bold text-white">🗳️인기 투표</h1>
        <div className="flex flex-col items-end">
          <select
            value={selectedSeason}
            onChange={handleSeasonChange}
            className="ml-4 px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#C7EB3E]"
          >
            {seasons.map((season) => (
              <option key={season.season_number} value={season.season_number}>
                {season.name}
              </option>
            ))}
          </select>
          <div className={styles.timerWrapper}>
            <<span className="timerText">{renderTimer()}</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center space-y-6">
        {pyramidLayout.map((row, rowIndex) => (
          <div key={rowIndex} className="flex justify-center gap-6 flex-wrap">
            {row.map((index) => {
              const coin = filteredCoins[index];
              if (!coin) return null;

              return (
                <div
                  key={coin.project_id}
                  className="relative voting-card pyramid-card group hover:bg-[#DFFF67] hover:text-black transition-all duration-300 transform hover:scale-105"
                >
                  {index < 3 && (
                    <img
                      src={`/assets/${index + 1}${['st', 'nd', 'rd'][index]}.png`}
                      alt={`${index + 1}위 뱃지`}
                      className="rank-badge absolute -top-3 -left-3 w-8 h-8 z-10"
                    />
                  )}

                  <div className="flex items-center">
                    <img
                      src={coin.logo}
                      alt={coin.name_ko}
                      className="w-14 h-14 rounded-full mr-4"
                    />
                    <div className="flex flex-col justify-center">
                      <div className={`font-bold ${index < 3 ? 'text-lg' : 'text-base'}`}>
                        {index < 3 ? `🔥 ${index + 1}위` : `${index + 1}위`}
                      </div>
                      <div className="voting-name text-md">{coin.name_ko}</div>
                      <div className="voting-symbol text-xs text-gray-400">{coin.symbol}</div>
                    </div>
                  </div>

                  <div className="absolute bottom-3 right-4 voting-count font-bold text-sm text-orange-400">
                    {coin.total_pick.toLocaleString()} 표
                  </div>

                  <button
                    className="absolute left-4 right-4 bottom-[-40px] group-hover:bottom-2 opacity-0 group-hover:opacity-100 visible group-hover:visible transition-all duration-300 bg-black text-white text-sm font-semibold py-1 rounded-md"
                  >
                    투표하러 가기
                  </button>
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
