import React from 'react';
import { useParams } from 'react-router-dom';
import {
  MessageCircle,
  Repeat2,
  Heart,
  Share2,
} from 'lucide-react';
import telegramChannels from '../lib/data/telegramchannels';
import "./TelegramFeedDetail.module.css"; // ✅


const TelegramFeedDetails = () => {
  const { username } = useParams();
  const posts = telegramChannels.filter((p) => p.username === username);

  if (posts.length === 0) {
    return <div className="text-white p-8">해당 채널 정보를 찾을 수 없습니다.</div>;
  }

  const { channelName, avatar } = posts[0];

  return (
    <div className="details-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="channel-info">
          <img src={avatar} alt={channelName} className="avatar" />
          <h2 className="channel-name">{channelName}</h2>
          <p className="handle">@{username}</p>
          <div className="subscriber-chart">[구독자 차트 자리]</div>
        </div>
      </aside>

      {/* Main feed */}
      <main className="feed-section">
        <h2 className="feed-title">📨 {channelName}의 최근 피드</h2>
        <div className="feed-list">
          {posts.map((post) => (
            <div
              key={post.id}
              className="feed-card"
              onClick={() => window.open(`https://t.me/${post.username}`, '_blank')}
            >
              <p className="feed-content">{post.content}</p>
              <div className="feed-meta">
                <div className="meta-group">
                  <MessageCircle className="icon" />
                  <span>{post.replies}</span>
                </div>
                <div className="meta-group">
                  <Repeat2 className="icon" />
                  <span>{post.forwards}</span>
                </div>
                <div className="meta-group">
                  <Heart className="icon" />
                  <span>{post.views}</span>
                </div>
                <div className="meta-group">
                  <Share2 className="icon" />
                  <span>{post.timestamp}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default TelegramFeedDetails;
