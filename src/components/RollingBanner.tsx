import React, { useEffect, useRef } from 'react';
import { ArrowUp, ArrowDown } from 'lucide-react';
import { Link } from 'react-router-dom';

const mockCoins = [
  {
    id: 'bitcoin',
    name: '비트코인',
    symbol: 'BTC',
    logo: 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png',
    price: 85951.27,
    priceChange: 0.84,
  },
  {
    id: 'ethereum',
    name: '이더리움',
    symbol: 'ETH',
    logo: 'https://assets.coingecko.com/coins/images/279/large/ethereum.png',
    price: 1645.34,
    priceChange: -0.28,
  },
  {
    id: 'solana',
    name: '솔라나',
    symbol: 'SOL',
    logo: 'https://assets.coingecko.com/coins/images/4128/large/solana.png',
    price: 132.53,
    priceChange: -0.57,
  },
  {
    id: 'ripple',
    name: '리플',
    symbol: 'XRP',
    logo: 'https://assets.coingecko.com/coins/images/44/large/xrp-symbol-white-128.png',
    price: 0.61,
    priceChange: 1.25,
  },
  {
    id: 'cardano',
    name: '카르다노',
    symbol: 'ADA',
    logo: 'https://assets.coingecko.com/coins/images/975/large/cardano.png',
    price: 0.69,
    priceChange: 0.00,
  },
  {
    id: 'avalanche',
    name: '아발란체',
    symbol: 'AVAX',
    logo: 'https://assets.coingecko.com/coins/images/12559/large/Avalanche_Circle_RedWhite_Trans.png',
    price: 0.161,
    priceChange: -2.10,
  },
  {
    id: 'polkadot',
    name: '폴카닷',
    symbol: 'DOT',
    logo: 'https://assets.coingecko.com/coins/images/12171/large/polkadot.png',
    price: 28.48,
    priceChange: 3.33,
  },
  {
    id: 'chainlink',
    name: '체인링크',
    symbol: 'LINK',
    logo: 'https://assets.coingecko.com/coins/images/877/large/chainlink-new-logo.png',
    price: 0.161,
    priceChange: 2.72,
  },
  {
    id: 'polygon',
    name: '폴리곤',
    symbol: 'MATIC',
    logo: 'https://assets.coingecko.com/coins/images/4713/large/matic-token-icon.png',
    price: 1.01,
    priceChange: -0.44,
  },
  {
    id: 'cosmos',
    name: '코스모스',
    symbol: 'ATOM',
    logo: 'https://assets.coingecko.com/coins/images/1481/large/cosmos_hub.png',
    price: 792.00,
    priceChange: -0.57,
  }
];

const RollingBanner = () => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scrollElement = scrollRef.current;
    if (!scrollElement) return;

    const scroll = () => {
      if (scrollElement.scrollLeft >= scrollElement.scrollWidth / 2) {
        scrollElement.scrollLeft = 0;
      } else {
        scrollElement.scrollLeft += 1;
      }
    };

    const intervalId = setInterval(scroll, 30);

    return () => clearInterval(intervalId);
  }, []);

  // Duplicate the coins array to create a seamless loop
  const displayCoins = [...mockCoins, ...mockCoins];

  return (
    <div className="bg-white border-y">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
        <div
          ref={scrollRef}
          className="overflow-hidden whitespace-nowrap"
          style={{ maskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)' }}
        >
          <div className="inline-flex space-x-8">
            {displayCoins.map((coin, index) => (
              <Link
                key={`${coin.id}-${index}`}
                to={`/coin/${coin.id}`}
                className="inline-flex items-center space-x-3 hover:bg-gray-50 px-4 py-2 rounded-lg transition-colors duration-200"
              >
                <img src={coin.logo} alt={coin.name} className="w-6 h-6" />
                <span className="font-medium text-gray-900">{coin.name}</span>
                <span className="text-gray-500">{coin.symbol}</span>
                <span className="font-medium text-gray-900">
                  ${coin.price.toLocaleString()}
                </span>
                <div className={`flex items-center ${coin.priceChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {coin.priceChange >= 0 ? (
                    <ArrowUp className="w-4 h-4" />
                  ) : (
                    <ArrowDown className="w-4 h-4" />
                  )}
                  <span className="ml-1">{Math.abs(coin.priceChange)}%</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RollingBanner;