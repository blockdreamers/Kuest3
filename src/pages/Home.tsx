import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowUp, ArrowDown, Timer, Trophy, Users, Twitter, MessageCircle, Send, DollarSign, Star } from 'lucide-react';

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

const mockVotingData = [
  {
    id: 1,
    name: 'Sui',
    symbol: 'SUI',
    logo: 'https://assets.coingecko.com/coins/images/26375/large/sui_asset.jpeg',
    votes: 912394,
    status: 'active',
    participated: false,
    deadline: '2024-03-20T00:00:00Z'
  },
  {
    id: 2,
    name: 'Aptos',
    symbol: 'APT',
    logo: 'https://assets.coingecko.com/coins/images/26455/large/aptos_round.png',
    votes: 856123,
    status: 'active',
    participated: false,
    deadline: '2024-03-21T00:00:00Z'
  },
  {
    id: 3,
    name: 'Sei',
    symbol: 'SEI',
    logo: 'https://assets.coingecko.com/coins/images/28205/large/Sei_Logo_-_Transparent.png',
    votes: 712394,
    status: 'active',
    participated: true,
    deadline: '2024-03-19T00:00:00Z'
  },
  {
    id: 4,
    name: 'Celestia',
    symbol: 'TIA',
    logo: 'https://assets.coingecko.com/coins/images/31967/large/tia.jpg',
    votes: 623456,
    status: 'active',
    participated: false,
    deadline: '2024-03-22T00:00:00Z'
  },
  {
    id: 5,
    name: 'Injective',
    symbol: 'INJ',
    logo: 'https://assets.coingecko.com/coins/images/12882/large/Secondary_Symbol.png',
    votes: 534567,
    status: 'active',
    participated: false,
    deadline: '2024-03-23T00:00:00Z'
  },
  {
    id: 6,
    name: 'Stacks',
    symbol: 'STX',
    logo: 'https://assets.coingecko.com/coins/images/2069/large/Stacks_logo_full.png',
    votes: 445678,
    status: 'active',
    participated: false,
    deadline: '2024-03-24T00:00:00Z'
  },
  {
    id: 7,
    name: 'Kaspa',
    symbol: 'KAS',
    logo: 'https://assets.coingecko.com/coins/images/25583/large/Kaspa_Logo_Mark_Color.png',
    votes: 356789,
    status: 'active',
    participated: false,
    deadline: '2024-03-25T00:00:00Z'
  },
  {
    id: 8,
    name: 'Mantle',
    symbol: 'MNT',
    logo: 'https://assets.coingecko.com/coins/images/30980/large/token-logo.png',
    votes: 267890,
    status: 'active',
    participated: false,
    deadline: '2024-03-26T00:00:00Z'
  },
  {
    id: 9,
    name: 'Manta',
    symbol: 'MANTA',
    logo: 'https://assets.coingecko.com/coins/images/32849/large/manta-logo-circular-blue-bg.png',
    votes: 178901,
    status: 'active',
    participated: false,
    deadline: '2024-03-27T00:00:00Z'
  },
  {
    id: 10,
    name: 'Pyth Network',
    symbol: 'PYTH',
    logo: 'https://assets.coingecko.com/coins/images/28483/large/pyth_symbol.png',
    votes: 89012,
    status: 'active',
    participated: false,
    deadline: '2024-03-28T00:00:00Z'
  }
];

const mockQuestData = [
  {
    id: 1,
    title: "Follow and Retweet Campaign",
    description: "Follow our Twitter account and retweet the pinned post about our latest protocol upgrade",
    reward: 25,
    rewardType: "USDT",
    platforms: ["twitter"],
    participants: 1234,
    deadline: "2024-03-25T00:00:00Z",
    difficulty: "Easy"
  },
  {
    id: 2,
    title: "Discord Community Engagement",
    description: "Join our Discord server and participate in technical discussions",
    reward: 15,
    rewardType: "USDC",
    platforms: ["discord"],
    participants: 856,
    deadline: "2024-03-26T00:00:00Z",
    difficulty: "Easy"
  },
  {
    id: 3,
    title: "Multi-Platform Ambassador",
    description: "Create and share content about our latest features across multiple platforms",
    reward: 50,
    rewardType: "USDT",
    platforms: ["twitter", "telegram"],
    participants: 567,
    deadline: "2024-03-27T00:00:00Z",
    difficulty: "Medium"
  },
  {
    id: 4,
    title: "Technical Documentation",
    description: "Help improve our technical documentation and tutorials",
    reward: 100,
    rewardType: "USDC",
    platforms: ["discord"],
    participants: 234,
    deadline: "2024-03-28T00:00:00Z",
    difficulty: "Hard"
  },
  {
    id: 5,
    title: "Community Support",
    description: "Provide support to new users in our Telegram group",
    reward: 20,
    rewardType: "USDT",
    platforms: ["telegram"],
    participants: 1567,
    deadline: "2024-03-29T00:00:00Z",
    difficulty: "Easy"
  },
  {
    id: 6,
    title: "Bug Bounty Program",
    description: "Find and report security vulnerabilities in our smart contracts",
    reward: 500,
    rewardType: "USDC",
    platforms: ["discord"],
    participants: 89,
    deadline: "2024-03-30T00:00:00Z",
    difficulty: "Hard"
  },
  {
    id: 7,
    title: "Meme Contest",
    description: "Create original memes about our project and share them",
    reward: 30,
    rewardType: "USDT",
    platforms: ["twitter", "discord"],
    participants: 2345,
    deadline: "2024-03-31T00:00:00Z",
    difficulty: "Easy"
  },
  {
    id: 8,
    title: "Governance Participation",
    description: "Participate in key governance votes and provide feedback",
    reward: 75,
    rewardType: "USDC",
    platforms: ["discord", "telegram"],
    participants: 432,
    deadline: "2024-04-01T00:00:00Z",
    difficulty: "Medium"
  },
  {
    id: 9,
    title: "DeFi Strategy Contest",
    description: "Design and share innovative DeFi strategies using our protocol",
    reward: 200,
    rewardType: "USDT",
    platforms: ["discord"],
    participants: 156,
    deadline: "2024-04-02T00:00:00Z",
    difficulty: "Hard"
  },
  {
    id: 10,
    title: "Community Translation",
    description: "Help translate our documentation into different languages",
    reward: 60,
    rewardType: "USDC",
    platforms: ["discord", "telegram"],
    participants: 678,
    deadline: "2024-04-03T00:00:00Z",
    difficulty: "Medium"
  },
  {
    id: 11,
    title: "NFT Design Challenge",
    description: "Create unique NFT designs for our upcoming collection",
    reward: 150,
    rewardType: "USDT",
    platforms: ["discord"],
    participants: 345,
    deadline: "2024-04-04T00:00:00Z",
    difficulty: "Hard"
  },
  {
    id: 12,
    title: "Social Media Challenge",
    description: "Create viral social media content about our ecosystem",
    reward: 45,
    rewardType: "USDC",
    platforms: ["twitter", "telegram"],
    participants: 890,
    deadline: "2024-04-05T00:00:00Z",
    difficulty: "Medium"
  }
];

const VotingCard = ({ coin, rank }) => {
  const [isHovered, setIsHovered] = useState(false);

  if (!coin) return null;

  return (
    <div
      className="relative group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative p-[1px] rounded-xl bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500">
        <div className="bg-white rounded-xl p-4 relative overflow-hidden">
          {isHovered && (
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 transition-all duration-200">
              <button className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium transform hover:scale-105 transition-all duration-200">
                Vote Now
              </button>
            </div>
          )}
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold">
              {rank}
            </div>
            <img src={coin.logo} alt={coin.name} className="w-8 h-8 rounded-full" />
            <div>
              <h3 className="font-semibold text-gray-900">{coin.name}</h3>
              <p className="text-sm text-gray-500">{coin.symbol}</p>
            </div>
          </div>
          <div className="mt-3">
            <p className="text-sm text-gray-500">Total Votes</p>
            <p className="font-semibold text-gray-900">{coin.votes.toLocaleString()}</p>
          </div>
          {coin.participated && (
            <div className="absolute top-2 right-2">
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Voted
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const QuestCard = ({ quest }) => {
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();

  const getPlatformIcon = (platform) => {
    switch (platform) {
      case 'twitter':
        return <Twitter className="h-4 w-4 text-blue-400" />;
      case 'discord':
        return <MessageCircle className="h-4 w-4 text-indigo-400" />;
      case 'telegram':
        return <Send className="h-4 w-4 text-sky-400" />;
      default:
        return null;
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty.toLowerCase()) {
      case 'easy':
        return 'bg-green-100 text-green-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'hard':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div
      className="relative group cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => navigate(`/quest/${quest.id}`)}
    >
      <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden">
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">{quest.title}</h3>
              <p className="text-sm text-gray-600 line-clamp-2">{quest.description}</p>
            </div>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(quest.difficulty)}`}>
              {quest.difficulty}
            </span>
          </div>

          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              {quest.platforms.map((platform, index) => (
                <div key={index} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                  {getPlatformIcon(platform)}
                </div>
              ))}
            </div>
            <div className="flex items-center space-x-1">
              <DollarSign className="h-4 w-4 text-green-500" />
              <span className="font-semibold text-green-500">{quest.reward} {quest.rewardType}</span>
            </div>
          </div>

          <div className="flex items-center justify-between text-sm text-gray-500">
            <div className="flex items-center space-x-1">
              <Users className="h-4 w-4" />
              <span>{quest.participants.toLocaleString()} participants</span>
            </div>
            <div className="flex items-center space-x-1">
              <Timer className="h-4 w-4" />
              <span>{new Date(quest.deadline).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Home = () => {
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Crypto Projects Section */}
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

      {/* Voting Status Section */}
      <div className="mb-16">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <h2 className="text-2xl font-bold text-gray-900">Voting Status</h2>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <Timer className="w-4 h-4" />
              <span>23:45:12 remaining</span>
            </div>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <Timer className="w-4 h-4" />
            <span>Updated every 5 minutes</span>
          </div>
        </div>

        <div className="flex flex-col items-center space-y-4">
          {/* Top position */}
          <div className="w-64">
            <VotingCard coin={mockVotingData[0]} rank={1} />
          </div>

          {/* Second row */}
          <div className="flex justify-center space-x-4">
            <div className="w-64">
              <VotingCard coin={mockVotingData[1]} rank={2} />
            </div>
            <div className="w-64">
              <VotingCard coin={mockVotingData[2]} rank={3} />
            </div>
          </div>

          {/* Third row */}
          <div className="flex justify-center space-x-4">
            <div className="w-64">
              <VotingCard coin={mockVotingData[3]} rank={4} />
            </div>
            <div className="w-64">
              <VotingCard coin={mockVotingData[4]} rank={5} />
            </div>
            <div className="w-64">
              <VotingCard coin={mockVotingData[5]} rank={6} />
            </div>
          </div>

          {/* Fourth row */}
          <div className="flex justify-center space-x-4">
            <div className="w-64">
              <VotingCard coin={mockVotingData[6]} rank={7} />
            </div>
            <div className="w-64">
              <VotingCard coin={mockVotingData[7]} rank={8} />
            </div>
            <div className="w-64">
              <VotingCard coin={mockVotingData[8]} rank={9} />
            </div>
            <div className="w-64">
              <VotingCard coin={mockVotingData[9]} rank={10} />
            </div>
          </div>
        </div>
      </div>

      {/* Ongoing Quests Section */}
      <div className="mt-16">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Ongoing Quests</h2>
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <Timer className="w-4 h-4" />
            <span>Updated daily</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockQuestData.map((quest) => (
            <QuestCard key={quest.id} quest={quest} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;