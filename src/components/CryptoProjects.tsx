import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUp, ArrowDown, Star } from 'lucide-react';
import styles from './CryptoProjects.module.css';
import { projectInfo } from '../lib/data/projectInfo';

const CryptoProjects = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [watchlist, setWatchlist] = useState<string[]>([]);
  const [showWatchlist, setShowWatchlist] = useState(false);

  const minimalCoins = projectInfo.map((coin) => ({
    id: coin.id,
    name: coin.name,
    symbol: coin.symbol,
    logo: coin.logo,
    price: coin.price,
    priceChange: coin.priceChange,
    marketCap: coin.marketCap,
    volume: coin.volume,
  }));

  const [filteredCoins, setFilteredCoins] = useState(minimalCoins);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    const filtered = minimalCoins.filter((coin) =>
      coin.name.toLowerCase().includes(query.toLowerCase()) ||
      coin.symbol.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredCoins(filtered);
  };

  const toggleWatchlist = (coinId: string, e: React.MouseEvent) => {
    e.preventDefault();
    setWatchlist((prev) =>
      prev.includes(coinId) ? prev.filter((id) => id !== coinId) : [...prev, coinId]
    );
  };

  const displayCoins = showWatchlist
    ? filteredCoins.filter((coin) => watchlist.includes(coin.id))
    : filteredCoins;

  return (
    <div className="mb-12 font-['Montserrat','Pretendard']">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-black">🔥요즘 핫한 코인</h1>
      </div>

      <div className="flex items-center justify-between mt-2 mb-2 text-sm text-gray-400">
        <p>한 번 눈여겨 볼만한 코인 프로젝트를 추려봤어요</p>
        <button
          onClick={() => setShowWatchlist(!showWatchlist)}
          className="flex items-center space-x-2 hover:text-[#C7EB3E]"
        >
          <Star className={`h-5 w-5 ${showWatchlist ? 'text-yellow-400 fill-current' : ''}`} />
          <span>관심{watchlist.length > 0 && ` (${watchlist.length})`}</span>
        </button>
      </div>

      <div className="mt-4 mb-6">
        <input
          type="text"
          placeholder="코인명 또는 티커로 검색"
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          className="w-full md:w-96 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C7EB3E] focus:border-transparent"
        />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-6">
        {displayCoins.map((coin) => (
          <Link key={coin.id} to={`/coin/${coin.id}`} className={`${styles.cryptoCard} ${styles.cryptoCardHover}`}>
            <div className={styles.cryptoCardInner}>
              <div className={`${styles.cryptoCardHeader} mb-[0.25rem]`}>
                <div className="flex items-center gap-2">
                  <img src={coin.logo} alt={coin.name} className="w-10 h-10 rounded-full" />
                  <div className="leading-tight">
                    <h2 className={styles.cryptoCoinName}>{coin.name}</h2>
                    <p className="text-xs text-gray-400">{coin.symbol}</p>
                  </div>
                </div>
                <button onClick={(e) => toggleWatchlist(coin.id, e)} className={styles.cryptoCardButton}>
                  <Star
                    className={`h-4 w-4 ${
                      watchlist.includes(coin.id)
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-400 hover:text-yellow-400'
                    }`}
                  />
                </button>
              </div>

              <div className="text-white mb-[0.3rem]">
                <p className={styles.cryptoTextBase}>${coin.price.toLocaleString()}</p>
                <div
                  className={`flex items-center text-sm ${
                    coin.priceChange >= 0 ? styles.cryptoGreen : styles.cryptoRed
                  } mb-2`}
                >
                  {coin.priceChange >= 0 ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
                  <span className="ml-1">{Math.abs(coin.priceChange)}%</span>
                </div>
              </div>

              <div className={`grid grid-cols-2 gap-2 text-xs text-white mt-[0.2rem] ${styles.cryptoStatsGrid}`}>
                <div>
                  <p className="text-gray-400">시가총액</p>
                  <p className="font-medium">${(coin.marketCap / 1e9).toFixed(1)}B</p>
                </div>
                <div>
                  <p className="text-gray-400">거래량 (24h)</p>
                  <p className="font-medium">${(coin.volume / 1e9).toFixed(1)}B</p>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default CryptoProjects;