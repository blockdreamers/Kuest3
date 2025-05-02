// src/pages/CryptoProjects.tsx

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUp, ArrowDown, Star } from 'lucide-react';
import './CryptoProjects.css';
import { projectInfo } from '../lib/data/projectInfo';

const CryptoProjects = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [watchlist, setWatchlist] = useState<string[]>([]);
  const [showWatchlist, setShowWatchlist] = useState(false);

  // 🔹 필요한 필드만 안전하게 추출해서 상태 저장
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
    const filtered = minimalCoins.filter(coin =>
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
          <Link
            key={coin.id}
            to={`/coin/${coin.id}`}
            className="coin-box group"
          >
            <div className="relative">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <img
                    src={coin.logo}
                    alt={coin.name}
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <h2 className="coin-name">{coin.name}</h2>
                    <p className="text-sm text-gray-400">{coin.symbol}</p>
                  </div>
                </div>
                <button
                  onClick={(e) => toggleWatchlist(coin.id, e)}
                  className="absolute top-0 right-0"
                >
                  <Star
                    className={`h-5 w-5 ${
                      watchlist.includes(coin.id)
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-400 hover:text-yellow-400'
                    }`}
                  />
                </button>
              </div>

              <div className="space-y-2 text-white">
                <div>
                  <p className="text-lg font-medium">${coin.price.toLocaleString()}</p>
                  <div className={`flex items-center ${coin.priceChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {coin.priceChange >= 0 ? (
                      <ArrowUp className="w-4 h-4" />
                    ) : (
                      <ArrowDown className="w-4 h-4" />
                    )}
                    <span className="ml-1">{Math.abs(coin.priceChange)}%</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs text-white">
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
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default CryptoProjects;
