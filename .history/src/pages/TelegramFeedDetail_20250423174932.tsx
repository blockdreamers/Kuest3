import React from 'react';
import { useParams } from 'react-router-dom';
import {
  MessageCircle,
  Repeat2,
  Heart,
  Share2,
} from 'lucide-react';
import telegramChannels from '../lib/data/telegramchannels';
import styles from "./TelegramFeedDetail.module.css"; // ✅ 모듈 import

const TelegramFeedDetail = () => {
  const { username } = useParams();
  const posts = telegramChannels.filter((p) => p.username === username);

  if (posts.length === 0) {
    return <div className="text-white p-8">해당 채널 정보를 찾을 수 없습니다.</div>;
  }

  const { channelName, avatar } = posts[0];

  return (
    <div className={styles["details-container"]}>
      {/* Sidebar */}
      <aside className={styles.sidebar}>
        <div className={styles["channel-info"]}>
          <img src={avatar} alt={channelName} className={styles.avatar} />
          <h2 className={styles["channel-name"]}>{channelName}</h2>
          <p className={styles.handle}>@{username}</p>
          <div className={styles["subscriber-chart"]}>[구독자수 변동]</div>
        </div>
      </aside>

      {/* Main feed */}
      <main className={styles["feed-section"]}>
        <h2 className={styles["feed-title"]}>📨 {channelName}의 최근 피드</h2>
        <div className={styles["feed-list"]}>
          {posts.map((post) => (
            <div
              key={post.id}
              className={styles["feed-card"]}
              onClick={() => window.open(`https://t.me/${post.username}`, '_blank')}
            >
              <p className={styles["feed-content"]}>{post.content}</p>
              <div className={styles["feed-meta"]}>
                <div className={styles["meta-group"]}>
                  <MessageCircle className={styles.icon} />
                  <span>{post.replies}</span>
                </div>
                <div className={styles["meta-group"]}>
                  <Repeat2 className={styles.icon} />
                  <span>{post.forwards}</span>
                </div>
                <div className={styles["meta-group"]}>
                  <Heart className={styles.icon} />
                  <span>{post.views}</span>
                </div>
                <div className={styles["meta-group"]}>
                  <Share2 className={styles.icon} />
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

export default TelegramFeedDetail;
