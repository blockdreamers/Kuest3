import React, { useEffect, useState } from 'react';
import {
  MessageCircle, Share2, Heart, Repeat2, ExternalLink,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import supabase from '../lib/supabase';
import './TelegramFeed.css';

const TelegramFeed = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      console.log('📡 Fetching Telegram posts from Supabase...');

      const { data, error } = await supabase
        .from('telegram_posts')
        .select(`
          id, sender_username, channel_title, avatar, content,
          replies, forwards, views, posted_at
        `)
        .order('posted_at', { ascending: false });

      if (error) {
        console.error('❌ Supabase fetch error:', error);
        setPosts([]);
      } else if (!data || !Array.isArray(data)) {
        console.warn('⚠️ No data returned from Supabase or data is not an array.');
        setPosts([]);
      } else {
        console.log(`✅ Supabase returned ${data.length} rows`);
        const grouped = Object.values(
          data.reduce((acc, post) => {
            if (!acc[post.sender_username]) {
              acc[post.sender_username] = post;
            }
            return acc;
          }, {} as Record<string, any>)
        );
        console.log(`🧩 Grouped into ${grouped.length} channels`);
        setPosts(grouped.slice(0, 20));
      }

      setLoading(false);
    };

    fetchPosts();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-black">📡텔레그램 모아보기</h1>
        <p className="mt-2 text-black">중요한 텔레그램 소식을 한 번에 확인해보세요!</p>
      </div>

      {loading ? (
        <div className="text-gray-500">로딩 중입니다...</div>
      ) : posts.length === 0 ? (
        <div className="text-gray-400">표시할 텔레그램 포스트가 없습니다.</div>
      ) : (
        <div className="telegram-grid">
          {posts.map((post) => (
            <div
              key={`${post.sender_username}-${post.id}`} // key 충돌 방지
              className="telegram-card cursor-pointer hover:shadow-lg transition"
              onClick={() => navigate(`/telegram/${post.sender_username}`)}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <img
                    src={post.avatar || '/default-avatar.png'}
                    alt={post.channel_title || 'unknown'}
                    className="telegram-avatar"
                  />
                  <div>
                    <h3 className="telegram-author text-sm font-semibold text-white">
                      {post.channel_title || '알 수 없음'}
                    </h3>
                    <p className="telegram-handle text-xs text-gray-400">
                      @{post.sender_username || 'unknown'}
                    </p>
                  </div>
                </div>
                <a
                  href={`https://t.me/${post.sender_username}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-600"
                  onClick={(e) => e.stopPropagation()}
                >
                  <ExternalLink className="h-4 w-4" />
                </a>
              </div>

              {/* Content */}
              <div className="telegram-content">
                {post.content || '(내용 없음)'}
              </div>

              {/* Footer */}
              <div className="telegram-meta">
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-1">
                    <MessageCircle className="h-3 w-3" />
                    <span>{post.replies ?? 0}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Repeat2 className="h-3 w-3" />
                    <span>{post.forwards ?? 0}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Heart className="h-3 w-3" />
                    <span>{post.views ?? 0}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-1">
                  <Share2 className="h-3 w-3" />
                  <span>{new Date(post.posted_at).toLocaleString()}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TelegramFeed;
