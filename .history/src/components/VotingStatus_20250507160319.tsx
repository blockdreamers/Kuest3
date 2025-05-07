// VotingStatus.tsx
import React, { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import './VotingStatus.css';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL!,
  import.meta.env.VITE_SUPABASE_ANON_KEY!
);

interface Season {
  season_number: number;
  name: string;
  start_at: string;
  end_at: string;
}

const VotingStatus = () => {
  const [seasons, setSeasons] = useState<Season[]>([]);
  const [currentTime, setCurrentTime] = useState<Date>(new Date());

  useEffect(() => {
    const fetchSeasons = async () => {
      const { data, error } = await supabase
        .from('voting_seasons')
        .select('*')
        .order('season_number', { ascending: true });

      if (error) console.error('시즌 데이터를 불러올 수 없습니다:', error);
      else setSeasons(data);
    };

    fetchSeasons();

    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const renderTimer = (season: Season) => {
    const now = currentTime.getTime();
    const start = new Date(season.start_at).getTime();
    const end = new Date(season.end_at).getTime();

    if (now < start) {
      const diff = start - now;
      return `시작까지 ${formatTime(diff)}`;
    } else if (now < end) {
      const diff = end - now;
      return `종료까지 ${formatTime(diff)}`;
    } else {
      return '종료된 시즌입니다.';
    }
  };

  const formatTime = (ms: number) => {
    const sec = Math.floor(ms / 1000);
    const days = Math.floor(sec / 86400);
    const hours = Math.floor((sec % 86400) / 3600);
    const minutes = Math.floor((sec % 3600) / 60);
    const seconds = sec % 60;

    return `${days}일 ${hours}시간 ${minutes}분 ${seconds}초`;
  };

  return (
    <div className="voting-status-wrapper">
      <div className="season-select">
        <select className="season-dropdown">
          {seasons.map((season) => (
            <option key={season.season_number}>
              {season.name}
            </option>
          ))}
        </select>
        {/* ⏰ 타이머는 시즌 선택 드롭다운 하단 우측 정렬 */}
        <div className="season-timer">
          {seasons.length > 0 && renderTimer(seasons[0])}
        </div>
      </div>
    </div>
  );
};

export default VotingStatus;
