import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Globe, MessageCircle, Twitter, Github, ExternalLink, Star, Vote, ArrowLeft } from 'lucide-react';

const CoinDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Mock data - will be replaced with real API data
  const coinData = {
    name: 'Bitcoin',
    symbol: 'BTC',
    price: 65432.10,
    priceChange24h: -5.31,
    marketCap: 1284567890123,
    circulatingSupply: 19.84,
    maxSupply: 21,
    fdv: 2.33,
    volume24h: 72.92,
    volumeMarketCap: 3.25,
    profileScore: 100,
    rating: 4.6,
    description: 'Bitcoin is the first decentralized cryptocurrency. It was created in 2009 by an unknown person or group using the name Satoshi Nakamoto.',
    links: {
      website: 'https://bitcoin.org',
      discord: 'https://discord.gg/bitcoin',
      telegram: 'https://t.me/bitcoin',
      twitter: 'https://twitter.com/bitcoin',
      reddit: 'https://reddit.com/r/bitcoin',
      github: 'https://github.com/bitcoin',
      whitepaper: 'https://bitcoin.org/bitcoin.pdf',
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button
        onClick={() => navigate(-1)}
        className="mb-6 flex items-center text-gray-600 hover:text-blue-600 transition-colors duration-200"
      >
        <ArrowLeft className="h-5 w-5 mr-2" />
        Back to list
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Coin Information */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <img
                  src={`https://assets.coingecko.com/coins/images/1/large/bitcoin.png`}
                  alt={coinData.name}
                  className="w-12 h-12"
                />
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    {coinData.name}
                    <span className="ml-2 text-gray-500 text-lg">{coinData.symbol}</span>
                  </h1>
                  <div className="flex items-center space-x-2">
                    <Star className="w-4 h-4 text-yellow-400" />
                    <span className="text-sm text-gray-600">Rank #1</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-gray-900">${coinData.price.toLocaleString()}</p>
                <p className="text-red-500">
                  {coinData.priceChange24h}% (24h)
                </p>
              </div>
            </div>

            {/* Price Statistics */}
            <div className="grid grid-cols-2 gap-6 mb-8">
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Market Cap</p>
                  <p className="text-lg font-semibold">₩{coinData.marketCap.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">FDV</p>
                  <p className="text-lg font-semibold">₩{coinData.fdv}P</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Circulating Supply</p>
                  <p className="text-lg font-semibold">{coinData.circulatingSupply}M BTC</p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">24h Volume</p>
                  <p className="text-lg font-semibold">₩{coinData.volume24h}T</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Volume/Market Cap</p>
                  <p className="text-lg font-semibold">{coinData.volumeMarketCap}%</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Max Supply</p>
                  <p className="text-lg font-semibold">{coinData.maxSupply}M BTC</p>
                </div>
              </div>
            </div>

            {/* Profile Score */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold mb-3">Profile Score</h2>
              <div className="bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-500 h-2 rounded-full" 
                  style={{ width: `${coinData.profileScore}%` }}
                ></div>
              </div>
              <p className="text-right text-sm text-gray-600 mt-1">{coinData.profileScore}%</p>
            </div>

            {/* Links */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold mb-4">Links</h2>
              <div className="grid grid-cols-2 gap-4">
                <a
                  href={coinData.links.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 text-gray-600 hover:text-blue-600"
                >
                  <Globe className="w-5 h-5" />
                  <span>Website</span>
                </a>
                <a
                  href={coinData.links.whitepaper}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 text-gray-600 hover:text-blue-600"
                >
                  <ExternalLink className="w-5 h-5" />
                  <span>Whitepaper</span>
                </a>
                <a
                  href={coinData.links.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 text-gray-600 hover:text-blue-600"
                >
                  <Github className="w-5 h-5" />
                  <span>Github</span>
                </a>
                <a
                  href={coinData.links.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 text-gray-600 hover:text-blue-600"
                >
                  <Twitter className="w-5 h-5" />
                  <span>Twitter</span>
                </a>
              </div>
            </div>

            {/* Description */}
            <div>
              <h2 className="text-lg font-semibold mb-3">About {coinData.name}</h2>
              <p className="text-gray-600 leading-relaxed">{coinData.description}</p>
            </div>
          </div>
        </div>

        {/* Right Column - Twitter Feed */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center space-x-2 mb-4">
              <Twitter className="w-5 h-5 text-blue-400" />
              <h2 className="text-lg font-semibold">Latest Tweets</h2>
            </div>
            <div className="space-y-4">
              {/* Twitter feed will be integrated here */}
              <div className="border rounded-lg p-4">
                <p className="text-gray-500 text-sm mb-2">Loading tweets...</p>
              </div>
              
              {/* Vote Button */}
              <button
                className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-lg shadow-lg hover:from-purple-700 hover:to-blue-700 transform hover:scale-105 transition-all duration-200 flex items-center justify-center space-x-2"
              >
                <Vote className="w-5 h-5" />
                <span>투표하러 가기</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CoinDetail;