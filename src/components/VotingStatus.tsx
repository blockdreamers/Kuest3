import React, { useEffect, useState } from 'react';
import supabase from '../lib/supabase';
import { fetchUSDKRW } from '../lib/utils/getExchangeRate';
import './VotingStatus.css';

const formatNumber = (value: number): string => value.toLocaleString();

const VotingCard = ({ coin, rank }: any) => {
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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const rate = await fetchUSDKRW();
        setExchangeRate(rate);

        const { data: votes, error: voteError } = await supabase
          .from('voting_status')
          .select('*')
          .order('total_pick', { ascending: false });

        const { data: projects, error: projectError } = await supabase
          .from('project_info')
          .select('slug, name, symbol, logo, price');

        if (voteError || projectError) {
          console.error('❌ 데이터 오류:', voteError || projectError);
          return;
        }

        const merged = votes.map((v) => {
          const p = projects.find((p) => p.slug === v.project_id);
          return p
            ? {
                ...v,
                ...p,
                price: Math.round((p.price || 0) * rate),
              }
            : null;
        }).filter(Boolean);

        setCoins(merged);
      } catch (err) {
        console.error('❌ 로딩 실패:', err);
      } finally {
        setLoading(false);
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
        {loading ? (
          <div className="text-center text-gray-500">로딩 중...</div>
        ) : coins.length === 0 ? (
          <div className="text-center text-gray-500">📭 표시할 데이터가 없습니다.</div>
        ) : (
          <div className="space-y-3 max-h-[600px] overflow-y-auto">
            {coins.map((coin, index) => (
              <VotingCard key={coin.project_id} coin={coin} rank={index + 1} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default VotingStatus;
