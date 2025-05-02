import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUp, ArrowDown, Star } from 'lucide-react';
import './CryptoProjects.css';
import { projectInfo } from '../lib/data/projectInfo';

const CryptoProjects = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredCoins, setFilteredCoins] = useState(projectInfo);
  const [watchlist, setWatchlist] = useState<string[]>([]);
  const [showWatchlist, setShowWatchlist] = useState(false);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    const filtered = projectInfo.filter(coin =>
      coin.name.toLowerCase().includes(query.toLowerCase()) ||
      coin.symbol.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredCoins(filtered);
  };

  const toggleWatchlist = (coinId: string, e: React.MouseEvent) => {
    e.preventDefault();
    setWatchlist(prev =>
      prev.includes(coinId)
        ? prev.filter(id => id !== coinId)
        : [...prev, coinId]
    );
  };

  const displayCoins = showWatchlist
    ? filteredCoins.filter(coin => watchlist.includes(coin.id))
    : filteredCoins;

  return (
    <div className="crypto-container font-['Montserrat','Pretendard']">
      <div className="crypto-header">
        <h1 className="crypto-title">🔥요즘 핫한 코인</h1>
        <p className="crypto-subtitle">한 번 눈여겨 볼만한 코인 프로젝트를 추려봤어요</p>
      </div>

      <div className="crypto-search-bar">
        <input
          type="text"
          placeholder="코인명 또는 티커로 검색"
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
        />
        <button onClick={() => setShowWatchlist(!showWatchlist)}>
          <Star className={`h-5 w-5 ${showWatchlist ? 'text-yellow-400 fill-current' : 'text-gray-400 hover:text-yellow-400'}`} />
          <span>관심{watchlist.length > 0 && ` (${watchlist.length})`}</span>
        </button>
      </div>

      <div className="crypto-grid">
        {displayCoins.map((coin) => (
          <Link key={coin.id} to={`/coin/${coin.id}`} className="coin-box group">
            <div className="coin-top">
              <img src={coin.logo} alt={coin.name} className="coin-logo" />
              <div className="coin-info">
                <h2 className="coin-name">{coin.name}</h2>
                <p className="coin-symbol">{coin.symbol}</p>
              </div>
              <Star
                onClick={(e) => toggleWatchlist(coin.id, e)}
                className={`coin-star ${watchlist.includes(coin.id) ? 'active' : ''}`}
              />
            </div>

            <div className="coin-price-section">
              <p className="coin-price">${coin.price.toLocaleString()}</p>
              <div className={`coin-change ${coin.priceChange >= 0 ? 'up' : 'down'}`}>
                {coin.priceChange >= 0 ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
                <span>{Math.abs(coin.priceChange)}%</span>
              </div>
            </div>

            <div className="coin-stats">
              <div>
                <p className="coin-label">시가총액</p>
                <p className="coin-value">${(coin.marketCap / 1e9).toFixed(1)}B</p>
              </div>
              <div>
                <p className="coin-label">거래량 (24h)</p>
                <p className="coin-value">${(coin.volume / 1e9).toFixed(1)}B</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default CryptoProjects;
