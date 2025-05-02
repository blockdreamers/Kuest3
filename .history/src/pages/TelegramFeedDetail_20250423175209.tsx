import React from 'react';
import { useParams } from 'react-router-dom';
import {
  MessageCircle,
  Repeat2,
  Heart,
  Share2,
} from 'lucide-react';
import styles from "./TelegramFeedDetail.module.css"; // ✅ 모듈 import

const TelegramFeedDetail = () => {
  const { username } = useParams();

  if (!username) {
    return <div className="text-white p-8">채널이 선택되지 않았습니다.</div>;
  }

  // Mock channel info (추후 백엔드에서 받아올 부분)
  const channelName = '임시 채널명';
  const avatar = `https://source.boringavatars.com/beam/120/${username}?colors=26A69A,EF5350,FFCA28`;

  // ✅ mock 피드 8개 생성
  const mockFeeds = Array.from({ length: 8 }, (_, i) => ({
    id: i + 1,
    username,
    content: `#${i + 1}번 피드입니다. 텔레그램에서의 공지나 이벤트 정보가 여기에 표시됩니다.`,
    replies: Math.floor(Math.random() * 5),
    forwards: Math.floor(Math.random() * 5),
    views: Math.floor(Math.random() * 300 + 100),
    timestamp: `2025-04-${String(20 + i).padStart(2, '0')} 16:${10 + i}`,
  }));

  return (
    <div className={styles["details-container"]}>
      {/* Sidebar */}
      <aside className={styles.sidebar}>
        <div className={styles["channel-info"]}>
          <img src={avatar} alt={channelName} className={styles.avatar} />
          <h2 className={styles["channel-name"]}>{channelName}</h2>
          <p className={styles.handle}>@{username}</p>
        </div>

        <div className={styles["subscriber-chart-wrapper"]}>
          <div className={styles["subscriber-chart"]}>[구독자수 변동]</div>
        </div>
      </aside>

      {/* Main feed */}
      <main className={styles["feed-section"]}>
        <h2 className={styles["feed-title"]}>📨 {channelName}의 최근 피드</h2>
        <div className={styles["feed-list"]}>
          {mockFeeds.map((post) => (
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
