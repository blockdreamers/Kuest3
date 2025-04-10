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
        comments: 89
      },
      {
        id: 2,
        content: "ETH/BTC pair showing weakness. Consider reducing ETH exposure until we see clear reversal signals. Key level to watch: 0.055",
        timestamp: "2024-03-19T08:15:00Z",
        likes: 956,
        comments: 67
      },
      {
        id: 3,
        content: "New DeFi protocol analysis coming up in 1 hour. This one looks promising with solid fundamentals and strong team backing.",
        timestamp: "2024-03-19T06:00:00Z",
        likes: 789,
        comments: 45
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
        comments: 54
      },
      {
        id: 2,
        content: "Market update: Altcoin season indicators flashing. Top picks for this cycle will be shared with premium members tonight.",
        timestamp: "2024-03-19T07:30:00Z",
        likes: 654,
        comments: 43
      }
    ]
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
                  <h2 className="text-xl font-bold text-gray-900">{selectedKOL.name}'s Posts</h2>
                  <p className="text-sm text-gray-600">{selectedKOL.telegramGroup}</p>
                </div>
              </div>
            </div>

            <div className="space-y-6 max-h-[600px] overflow-y-auto">
              {selectedKOL.telegramPosts.map((post) => (
                <div key={post.id} className="border rounded-lg p-4">
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
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KOL;