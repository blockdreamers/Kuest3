import React, { useState } from 'react';
import { MessageCircle, Users, ExternalLink, Star, TrendingUp, Calendar } from 'lucide-react';

const mockKOLs = [
  {
    id: 1,
    name: "Crypto Master",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    followers: 125000,
    telegramGroup: "CryptoMasterOfficial",
    telegramMembers: 45000,
    rating: 4.8,
    verified: true,
    specialties: ["Technical Analysis", "DeFi", "NFTs"],
    recentPosts: 156,
    successRate: 89,
    telegramPosts: [
      {
        id: 1,
        content: "BTC looking bullish with strong support at $65k. Expecting a push to $70k in the next 24-48 hours. Set your stops at $63.5k.",
        timestamp: "2024-03-19T10:30:00Z",
        likes: 1234,
        comments: 89,
        link: "https://t.me/CryptoMasterOfficial/1"
      },
      {
        id: 2,
        content: "ETH/BTC pair showing weakness. Consider reducing ETH exposure until we see clear reversal signals. Key level to watch: 0.055",
        timestamp: "2024-03-19T08:15:00Z",
        likes: 956,
        comments: 67,
        link: "https://t.me/CryptoMasterOfficial/2"
      },
      {
        id: 3,
        content: "New DeFi protocol analysis coming up in 1 hour. This one looks promising with solid fundamentals and strong team backing.",
        timestamp: "2024-03-19T06:00:00Z",
        likes: 789,
        comments: 45,
        link: "https://t.me/CryptoMasterOfficial/3"
      }
    ]
  },
  {
    id: 2,
    name: "Blockchain Jane",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    followers: 98000,
    telegramGroup: "JaneCryptoSignals",
    telegramMembers: 32000,
    rating: 4.6,
    verified: true,
    specialties: ["Altcoins", "ICO Analysis", "Market Trends"],
    recentPosts: 123,
    successRate: 85,
    telegramPosts: [
      {
        id: 1,
        content: "Just finished analyzing the latest L2 solution. Full report coming in the next hour. Spoiler: Very impressive tech stack!",
        timestamp: "2024-03-19T09:45:00Z",
        likes: 876,
        comments: 54,
        link: "https://t.me/JaneCryptoSignals/1"
      }
    ]
  },
  {
    id: 3,
    name: "Crypto Whale",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    followers: 156000,
    telegramGroup: "WhaleAlerts",
    telegramMembers: 52000,
    rating: 4.9,
    verified: true,
    specialties: ["Whale Watching", "Market Analysis"],
    recentPosts: 89,
    successRate: 92,
    telegramPosts: []
  },
  {
    id: 4,
    name: "DeFi Guru",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    followers: 87000,
    telegramGroup: "DeFiInsights",
    telegramMembers: 28000,
    rating: 4.7,
    verified: true,
    specialties: ["DeFi", "Yield Farming"],
    recentPosts: 145,
    successRate: 88,
    telegramPosts: []
  },
  {
    id: 5,
    name: "NFT Hunter",
    avatar: "https://images.unsplash.com/photo-1550525811-e5869dd03032?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    followers: 76000,
    telegramGroup: "NFTAlerts",
    telegramMembers: 24000,
    rating: 4.5,
    verified: true,
    specialties: ["NFTs", "Digital Art"],
    recentPosts: 167,
    successRate: 86,
    telegramPosts: []
  },
  {
    id: 6,
    name: "Tech Analyst",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    followers: 65000,
    telegramGroup: "TechAnalysis",
    telegramMembers: 21000,
    rating: 4.4,
    verified: true,
    specialties: ["Technical Analysis"],
    recentPosts: 134,
    successRate: 84,
    telegramPosts: []
  },
  {
    id: 7,
    name: "Crypto News",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    followers: 112000,
    telegramGroup: "CryptoNewsDaily",
    telegramMembers: 38000,
    rating: 4.7,
    verified: true,
    specialties: ["News", "Market Updates"],
    recentPosts: 198,
    successRate: 90,
    telegramPosts: []
  },
  {
    id: 8,
    name: "Altcoin Expert",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    followers: 92000,
    telegramGroup: "AltcoinSignals",
    telegramMembers: 31000,
    rating: 4.6,
    verified: true,
    specialties: ["Altcoins", "Trading"],
    recentPosts: 156,
    successRate: 87,
    telegramPosts: []
  },
  {
    id: 9,
    name: "Mining Pro",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    followers: 58000,
    telegramGroup: "MiningInsights",
    telegramMembers: 19000,
    rating: 4.5,
    verified: true,
    specialties: ["Mining", "Hardware"],
    recentPosts: 112,
    successRate: 85,
    telegramPosts: []
  },
  {
    id: 10,
    name: "Chain Master",
    avatar: "https://images.unsplash.com/photo-1550525811-e5869dd03032?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    followers: 71000,
    telegramGroup: "ChainMaster",
    telegramMembers: 23000,
    rating: 4.6,
    verified: true,
    specialties: ["Blockchain", "Development"],
    recentPosts: 143,
    successRate: 88,
    telegramPosts: []
  }
];

const KOL = () => {
  const [selectedKOL, setSelectedKOL] = useState(mockKOLs[0]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Event Banner */}
      <div className="mb-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl overflow-hidden relative">
        <img 
          src="https://images.unsplash.com/photo-1620121692029-d088224ddc74?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2000&q=80"
          alt="Current Event"
          className="w-full h-48 object-cover opacity-50"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <h1 className="text-3xl font-bold text-white">KOL Trading Competition</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* KOL List - 30% width */}
        <div className="lg:col-span-4 space-y-4">
          {mockKOLs.map((kol) => (
            <div 
              key={kol.id} 
              className={`bg-white rounded-xl shadow-lg p-4 cursor-pointer transition-all duration-200 ${
                selectedKOL.id === kol.id ? 'ring-2 ring-blue-500' : 'hover:shadow-xl'
              }`}
              onClick={() => setSelectedKOL(kol)}
            >
              <div className="flex items-center space-x-3">
                <img
                  src={kol.avatar}
                  alt={kol.name}
                  className="w-12 h-12 rounded-full"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <h2 className="font-semibold text-gray-900">{kol.name}</h2>
                      {kol.verified && (
                        <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          ✓
                        </span>
                      )}
                    </div>
                    <button className="text-blue-600 hover:text-blue-800">
                      <Star className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="flex items-center space-x-3 mt-1 text-sm text-gray-600">
                    <div className="flex items-center">
                      <Users className="h-3 w-3 mr-1" />
                      {kol.followers.toLocaleString()}
                    </div>
                    <div className="flex items-center">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      {kol.successRate}%
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-3 flex items-center justify-between text-sm">
                <a
                  href={`https://t.me/${kol.telegramGroup}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-blue-600 hover:text-blue-800"
                  onClick={(e) => e.stopPropagation()}
                >
                  <MessageCircle className="h-4 w-4 mr-1" />
                  Join Telegram
                </a>
                <span className="text-gray-500">{kol.telegramMembers.toLocaleString()} members</span>
              </div>
            </div>
          ))}
        </div>

        {/* Telegram Posts - 70% width */}
        <div className="lg:col-span-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <img
                  src={selectedKOL.avatar}
                  alt={selectedKOL.name}
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <h2 className="text-xl font-bold text-gray-900">{selectedKOL.name}'s Recent Posts</h2>
                  <p className="text-sm text-gray-600">{selectedKOL.telegramGroup}</p>
                </div>
              </div>
            </div>

            <div className="space-y-4 max-h-[600px] overflow-y-auto">
              {selectedKOL.telegramPosts.map((post) => (
                <a
                  key={post.id}
                  href={post.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                  <div className="border rounded-lg p-4 hover:border-blue-300 hover:shadow-md transition-all duration-200 transform hover:-translate-y-1">
                    <p className="text-gray-900 mb-3">{post.content}</p>
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <div className="flex items-center space-x-4">
                        <span className="flex items-center">
                          <Star className="h-4 w-4 mr-1" />
                          {post.likes}
                        </span>
                        <span className="flex items-center">
                          <MessageCircle className="h-4 w-4 mr-1" />
                          {post.comments}
                        </span>
                      </div>
                      <span className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        {formatDate(post.timestamp)}
                      </span>
                    </div>
                  </div>
                </a>
              ))}
              {selectedKOL.telegramPosts.length === 0 && (
                <div className="text-center text-gray-500 py-8">
                  No recent posts available
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KOL;