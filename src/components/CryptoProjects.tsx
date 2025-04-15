import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUp, ArrowDown, Star } from 'lucide-react';

const mockData = [
  {
    id: 'bitcoin',
    name: 'Bitcoin',
    symbol: 'BTC',
    logo: 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png',
    price: 65432.10,
    priceChange: 2.5,
    marketCap: 1284567890123,
    volume: 28456789012,
  },
  {
    id: 'ethereum',
    name: 'Ethereum',
    symbol: 'ETH',
    logo: 'https://assets.coingecko.com/coins/images/279/large/ethereum.png',
    price: 3432.15,
    priceChange: -1.2,
    marketCap: 384567890123,
    volume: 18456789012,
  },
  {
    id: 'solana',
    name: 'Solana',
    symbol: 'SOL',
    logo: 'https://assets.coingecko.com/coins/images/4128/large/solana.png',
    price: 125.43,
    priceChange: 5.8,
    marketCap: 54567890123,
    volume: 4456789012,
  },
  {
    id: 'cardano',
    name: 'Cardano',
    symbol: 'ADA',
    logo: 'https://assets.coingecko.com/coins/images/975/large/cardano.png',
    price: 0.65,
    priceChange: -2.1,
    marketCap: 22567890123,
    volume: 1456789012,
  },
  {
    id: 'ripple',
    name: 'Ripple',
    symbol: 'XRP',
    logo: 'https://assets.coingecko.com/coins/images/44/large/xrp-symbol-white-128.png',
    price: 0.58,
    priceChange: 1.4,
    marketCap: 31567890123,
    volume: 2456789012,
  },
  {
    id: 'polkadot',
    name: 'Polkadot',
    symbol: 'DOT',
    logo: 'https://assets.coingecko.com/coins/images/12171/large/polkadot.png',
    price: 7.82,
    priceChange: 3.2,
    marketCap: 9867890123,
    volume: 756789012,
  },
  {
    id: 'avalanche',
    name: 'Avalanche',
    symbol: 'AVAX',
    logo: 'https://assets.coingecko.com/coins/images/12559/large/Avalanche_Circle_RedWhite_Trans.png',
    price: 35.67,
    priceChange: 4.5,
    marketCap: 12567890123,
    volume: 956789012,
  },
  {
    id: 'chainlink',
    name: 'Chainlink',
    symbol: 'LINK',
    logo: 'https://assets.coingecko.com/coins/images/877/large/chainlink-new-logo.png',
    price: 18.23,
    priceChange: -0.8,
    marketCap: 10267890123,
    volume: 856789012,
  },
  {
    id: 'polygon',
    name: 'Polygon',
    symbol: 'MATIC',
    logo: 'https://assets.coingecko.com/coins/images/4713/large/matic-token-icon.png',
    price: 0.92,
    priceChange: 1.7,
    marketCap: 8967890123,
    volume: 656789012,
  },
  {
    id: 'cosmos',
    name: 'Cosmos',
    symbol: 'ATOM',
    logo: 'https://assets.coingecko.com/coins/images/1481/large/cosmos_hub.png',
    price: 9.45,
    priceChange: -1.5,
    marketCap: 7567890123,
    volume: 556789012,
  },
  {
    id: 'uniswap',
    name: 'Uniswap',
    symbol: 'UNI',
    logo: 'https://assets.coingecko.com/coins/images/12504/large/uniswap-uni.png',
    price: 7.12,
    priceChange: 2.3,
    marketCap: 6567890123,
    volume: 456789012,
  },
  {
    id: 'near-protocol',
    name: 'NEAR Protocol',
    symbol: 'NEAR',
    logo: 'https://assets.coingecko.com/coins/images/10365/large/near.jpg',
    price: 3.45,
    priceChange: -0.9,
    marketCap: 5567890123,
    volume: 356789012,
  }
];

const CryptoProjects = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredCoins, setFilteredCoins] = useState(mockData);
  const [watchlist, setWatchlist] = useState<string[]>([]);
  const [showWatchlist, setShowWatchlist] = useState(false);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    const filtered = mockData.filter(coin => 
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
    <div className="mb-12">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Crypto Projects</h1>
        <button
          onClick={() => setShowWatchlist(!showWatchlist)}
          className="flex items-center space-x-2 text-gray-600 hover:text-blue-600"
        >
          <Star className={`h-5 w-5 ${showWatchlist ? 'text-yellow-400 fill-current' : ''}`} />
          <span>관심 목록{watchlist.length > 0 && ` (${watchlist.length})`}</span>
        </button>
      </div>
      <p className="mt-2 text-gray-600">We introduce a promising new project to crypto users in South Korea</p>
      
      <div className="mt-4 mb-6">
        <input
          type="text"
          placeholder="코인명 또는 티커로 검색"
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          className="w-full md:w-96 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-6">
        {displayCoins.map((coin) => (
          <Link
            key={coin.id}
            to={`/coin/${coin.id}`}
            className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200 p-4"
          >
            <div className="relative">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <img
                    src={coin.logo}
                    alt={coin.name}
                    className="w-12 h-12 rounded-full"
                  />
                  <div>
                    <h2 className="font-semibold text-gray-900">{coin.name}</h2>
                    <p className="text-sm text-gray-500">{coin.symbol}</p>
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
              
              <div className="space-y-2">
                <div>
                  <p className="text-lg font-bold text-gray-900">
                    ${coin.price.toLocaleString()}
                  </p>
                  <div className={`flex items-center ${coin.priceChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {coin.priceChange >= 0 ? (
                      <ArrowUp className="w-4 h-4" />
                    ) : (
                      <ArrowDown className="w-4 h-4" />
                    )}
                    <span className="ml-1">{Math.abs(coin.priceChange)}%</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <p className="text-gray-500">시가총액</p>
                    <p className="font-medium text-gray-900">
                      ${(coin.marketCap / 1e9).toFixed(1)}B
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500">거래량 (24h)</p>
                    <p className="font-medium text-gray-900">
                      ${(coin.volume / 1e9).toFixed(1)}B
                    </p>
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