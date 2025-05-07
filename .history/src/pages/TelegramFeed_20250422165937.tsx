import React from 'react';
import {
  MessageCircle,
  Share2,
  Heart,
  Repeat2,
  ExternalLink,
} from 'lucide-react';
import telegramChannels from '../lib/data/telegramchannels';
import './TelegramFeed.css'; // ✅ 스타일 적용

const TelegramFeed = () => {
  const posts = telegramChannels.slice(0, 20);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">📡 최신 텔레그램 포스팅</h1>
        <p className="mt-2 text-gray-300">최근 텔레그램 포스팅을 확인하세요!</p>
      </div>

      <div className="telegram-grid">
        {posts.map((post) => (
          <div key={post.id} className="telegram-card">
            {/* Header */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                <img
                  src={post.avatar}
                  alt={post.channelName}
                  className="telegram-avatar"
                />
                <div>
                  <h3 className="text-sm font-semibold text-white">
                    {post.channelName}
                  </h3>
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
            <div className="telegram-content">{post.content}</div>

            {/* Footer */}
            <div className="telegram-meta">
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
