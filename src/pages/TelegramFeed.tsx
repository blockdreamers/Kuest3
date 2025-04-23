import React from 'react';
import {
  MessageCircle,
  Share2,
  Heart,
  Repeat2,
  ExternalLink,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import telegramChannels from '../lib/data/telegramchannels';
import './TelegramFeed.css';

const TelegramFeed = () => {
  const navigate = useNavigate();
  const posts = telegramChannels.slice(0, 20);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-black">📡텔레그램 모아보기</h1>
        <p className="mt-2 text-black">중요한 텔레그램 소식을 한 번에 확인해보세요!</p>
      </div>

      <div className="telegram-grid">
        {posts.map((post) => (
          <div
            key={post.id}
            className="telegram-card cursor-pointer hover:shadow-lg transition"
            onClick={() => navigate(`/telegram/${post.username}`)} // ✅ 이동 로직 추가
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                <img
                  src={post.avatar}
                  alt={post.channelName}
                  className="telegram-avatar"
                />
                <div>
                  <h3 className="telegram-author text-sm font-semibold text-white">
                    {post.channelName}
                  </h3>
                  <p className="telegram-handle text-xs text-gray-400">@{post.username}</p>
                </div>
              </div>
              <a
                href={`https://t.me/${post.username}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-600"
                onClick={(e) => e.stopPropagation()} // ✅ 클릭 이벤트 분리
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
