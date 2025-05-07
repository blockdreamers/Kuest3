import React, { useEffect, useState } from 'react';
import { Vote } from 'lucide-react';
import supabase from '../lib/supabase';
import styles from './CoinDetail.module.css';

interface VotingInfoBoxProps {
  coinId: string;
  coinName: string;
  coinSymbol: string;
}

interface Season {
  season_number: number;
  name: string;
}

interface SeasonData {
  season: number;
  total_pick: number;
  user_pick: number;
  total_airdrop: number;
  rank: number;
}

const VotingInfoBox: React.FC<VotingInfoBoxProps> = ({ coinId, coinName, coinSymbol }) => {
  const [seasons, setSeasons] = useState<Season[]>([]);
  const [selectedSeason, setSelectedSeason] = useState<number>(1);
  const [seasonData, setSeasonData] = useState<SeasonData | null>(null);

  useEffect(() => {
    const fetchSeasons = async () => {
      const { data, error } = await supabase
        .from('voting_seasons')
        .select('season_number, name')
        .order('season_number');

      if (!error && data) {
        setSeasons(data);
        setSelectedSeason(data[0]?.season_number || 1);
      }
    };
    fetchSeasons();
  }, []);

  useEffect(() => {
    const fetchSeasonData = async () => {
      const { data, error } = await supabase
        .rpc('get_coin_voting_stats', { coin_id: coinId, season_num: selectedSeason });

      if (!error && data) setSeasonData(data);
    };
    if (coinId && selectedSeason) fetchSeasonData();
  }, [coinId, selectedSeason]);

  return (
    <div className={styles['coin-detail-right-box']}>
      <div className="flex justify-between items-start mb-3 w-full">
        <h2 className="text-lg font-semibold">투표 현황</h2>
        <select
          value={selectedSeason}
          onChange={(e) => setSelectedSeason(Number(e.target.value))}
          className="text-sm px-2 py-1 rounded-md bg-black border border-gray-600 text-white"
        >
          {seasons.map((season) => (
            <option key={season.season_number} value={season.season_number}>
              {season.name}
            </option>
          ))}
        </select>
      </div>

      <p className="text-sm text-gray-300 mb-4">
        {coinName} 프로젝트는 <strong>#시즌1</strong>, <strong>#시즌2</strong>에 참여하여 총{' '}
        <strong>{seasonData?.total_pick?.toLocaleString() || '0'}</strong>표를 획득하였으며,
        누적 투표수 기준 <strong>{seasonData?.rank || '-'}위</strong>입니다.
      </p>

      <div className="text-sm text-white space-y-2 mb-4 w-full">
        <div className="flex justify-between">
          <span className="text-gray-400">누적 투표수</span>
          <span>{seasonData?.total_pick?.toLocaleString() || '0'} 표</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">나의 투표수</span>
          <span>{seasonData?.user_pick?.toLocaleString() || '0'} 표</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">이번 시즌 에어드랍 수량</span>
          <span>{seasonData?.total_airdrop?.toLocaleString() || '0'} {coinSymbol}</span>
        </div>
      </div>

      <button className={styles['coin-detail-vote-btn']}>
        <Vote className="w-5 h-5" />
        <span>투표하러 가기</span>
      </button>
    </div>
  );
};

export default VotingInfoBox;