import React from 'react';
import { MessageCircle, Share2, Heart, Repeat2, ExternalLink } from 'lucide-react';

const mockTelegramPosts = Array.from({ length: 16 }, (_, i) => ({
  id: i + 1,
  channelName: '코인피드',
  username: 'coinchannel',
  content: '📢 이건 텔레그램 콘텐츠 샘플입니다. 다양한 내용을 보여주기 위해 여러 줄의 텍스트를 포함할 수 있습니다. 여기까지 읽어주셔서 감사합니다!',
  timestamp: '2024-04-15 18:00',
  views: Math.floor(Math.random() * 500),
  replies: Math.floor(Math.random() * 10),
  forwards: Math.floor(Math.random() * 5),
  avatar: 'https://images.unsplash.com/photo-1550525811-e5869dd03032'
}));

const TelegramFeed = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">📡 최신 텔레그램 포스팅</h1>
        <p className="mt-2 text-gray-300">최근 텔레그램 포스팅을 확인하세요!</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {mockTelegramPosts.map((post) => (
          <div key={post.id} className="bg-[#121212] rounded-xl shadow-md border border-gray-800 p-4 text-white">
            {/* Header */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                <img
                  src={post.avatar}
                  alt={post.channelName}
                  className="w-8 h-8 rounded-full"
                />
                <div>
                  <h3 className="text-sm font-semibold text-white">{post.channelName}</h3>
                  <p className="text-xs text-gray-400">@{post.username}</p>
                </div>
              </div>
              <a
                href={`https://t.me/${post.username}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-600"
              >
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>

            {/* Content */}
            <div className="mb-3">
              <p className="text-sm text-gray-100 whitespace-pre-line line-clamp-6">{post.content}</p>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between text-xs text-gray-500">
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-1">
                  <MessageCircle className="h-3 w-3" />
                  <span>{post.replies}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Repeat2 className="h-3 w-3" />
                  <span>{post.forwards}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Heart className="h-3 w-3" />
                  <span>{post.views}</span>
                </div>
              </div>
              <div className="flex items-center space-x-1">
                <Share2 className="h-3 w-3" />
                <span>{post.timestamp}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TelegramFeed;
