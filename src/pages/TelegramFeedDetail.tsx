import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  MessageCircle,
  Repeat2,
  Heart,
  Share2,
  ArrowLeft,
} from 'lucide-react';
import styles from "./TelegramFeedDetail.module.css";

const TelegramFeedDetail = () => {
  const { username } = useParams();
  const navigate = useNavigate();

  if (!username) {
    return <div className="text-white p-8">채널이 선택되지 않았습니다.</div>;
  }

  const channelName = '가즈아주의자';
  const avatar = `https://www.hola.com/us/celebrities/20241205734386/barron-trump-video-games-nyu/`;

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
        <button onClick={() => navigate(-1)} className={styles["back-button"]}>
          <ArrowLeft className={styles["back-icon"]} /> 목록으로 돌아가기
        </button>

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