import React, { useState, useEffect } from 'react';

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

const VotingCard = ({ coin, rank }) => {
  const [isHovered, setIsHovered] = useState(false);

  if (!coin) return null;

  return (
    <div
      className="relative bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200 p-4"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="w-8 h-8 flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold rounded-full">
            {rank}
          </div>
          <img src={coin.logo} alt={coin.name} className="w-10 h-10 rounded-full" />
          <div>
            <h3 className="font-semibold text-gray-900">{coin.name}</h3>
            <p className="text-sm text-gray-500">{coin.symbol}</p>
          </div>
        </div>
        <div className="flex items-center space-x-8">
          <div className="text-right">
            <p className="text-sm text-gray-500">Market Cap</p>
            <p className="font-medium text-gray-900">${(coin.votes * 1000).toLocaleString()}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Price</p>
            <p className="font-medium text-gray-900">${(coin.votes / 100).toFixed(2)}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Total Votes</p>
            <p className="font-medium text-gray-900">{coin.votes.toLocaleString()}</p>
          </div>
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            Vote
          </button>
        </div>
      </div>
    </div>
  );
};

const CountdownTimer = () => {
  const [timeLeft, setTimeLeft] = useState('');
  const targetDate = new Date('2025-12-31T03:00:00.000Z'); // KST (UTC+9) midnight

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const difference = targetDate.getTime() - now.getTime();
      
      if (difference <= 0) {
        setTimeLeft('00:00:00:00');
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((difference / 1000 / 60) % 60);
      const seconds = Math.floor((difference / 1000) % 60);

      setTimeLeft(
        `${days.toString().padStart(2, '0')}:${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
      );
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="font-mono text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">
      {timeLeft}
    </div>
  );
};

const VotingStatus = () => {
  return (
    <div className="mb-16">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">인기 투표</h2>
        <CountdownTimer />
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="space-y-4 max-h-[600px] overflow-y-auto">
          {mockVotingData.slice(0, 10).map((coin, index) => (
            <VotingCard key={coin.id} coin={coin} rank={index + 1} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default VotingStatus;