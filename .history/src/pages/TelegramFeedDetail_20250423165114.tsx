import React from 'react';
import { useParams } from 'react-router-dom';
import { ExternalLink, MessageCircle, Repeat2, Heart, Share2 } from 'lucide-react';
import './TelegramFeedDetails.module.css';
import channelMock from '../lib/data/telegramchannels'; // contains both channel & feed data

const TelegramFeedDetails = () => {
  const { username } = useParams();
  const channel = channelMock.find((c) => c.username === username);

  if (!channel) return <div className="text-center p-8 text-white">채널 정보를 찾을 수 없습니다.</div>;

  return (
    <div className="details-container">
      {/* Sidebar - Channel Info */}
      <aside className="sidebar">
        <div className="channel-info">
          <img src={channel.avatar} alt={channel.channelName} className="avatar" />
          <h2 className="channel-name">{channel.channelName}</h2>
          <p className="handle">@{channel.username}</p>
          <div className="subscriber-chart">[구독자 차트 placeholder]</div>
        </div>
      </aside>

      {/* Main Feed Section */}
      <main className="feed-section">
        <h2 className="feed-title">📨 {channel.channelName}의 최근 피드</h2>
        <div className="feed-list">
          {channel.feeds.map((post) => (
            <div
              key={post.id}
              className="feed-card"
              onClick={() => window.open(`https://t.me/${channel.username}/${post.messageId}`, '_blank')}
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
