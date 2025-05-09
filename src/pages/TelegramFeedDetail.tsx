import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  MessageCircle,
  Repeat2,
  Heart,
  Share2,
  ArrowLeft,
} from 'lucide-react';
import supabase from '../lib/supabase';
import styles from './TelegramFeedDetail.module.css';

const PAGE_SIZE = 20;

const TelegramFeedDetail = () => {
  const { username } = useParams();
  const navigate = useNavigate();
  const [posts, setPosts] = useState<any[]>([]);
  const [category, setCategory] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const offsetRef = useRef(0);

  const fetchPosts = useCallback(async () => {
    if (!username || loading || !hasMore) return;
    setLoading(true);

    const { data, error } = await supabase
      .from('telegram_posts')
      .select('*')
      .eq('sender_username', username)
      .order('posted_at', { ascending: false })
      .range(offsetRef.current, offsetRef.current + PAGE_SIZE - 1);

    if (error) {
      console.error('❌ Error fetching posts:', error);
    } else {
      setPosts(prev => [...prev, ...data]);
      offsetRef.current += data.length;
      if (data.length < PAGE_SIZE) setHasMore(false);
    }
    setLoading(false);
  }, [username, loading, hasMore]);

  const fetchCategory = useCallback(async () => {
    if (!username) return;
    const { data, error } = await supabase
      .from('telegram_channel_avatars')
      .select('category')
      .eq('username', username)
      .single();

    if (error) {
      console.error('⚠️ Error fetching category:', error);
      return;
    }
    setCategory(data?.category ?? null);
  }, [username]);

  useEffect(() => {
    offsetRef.current = 0;
    setPosts([]);
    setHasMore(true);
    fetchPosts();
    fetchCategory();
  }, [username]);

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >= document.body.offsetHeight - 500 &&
        !loading && hasMore
      ) {
        fetchPosts();
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [fetchPosts, loading, hasMore]);

  if (!username) return <div className="text-white p-8">채널이 선택되지 않았습니다.</div>;

  const channelName = posts[0]?.channel_name || username;
  const avatar = posts[0]?.avatar || '/default-avatar.png';

  return (
    <div className={styles['details-container']}>
      <aside className={styles.sidebar}>
        <button onClick={() => navigate(-1)} className={styles['back-button']}>
          <ArrowLeft className={styles['back-icon']} /> 목록으로 돌아가기
        </button>

        <div className={styles['channel-info']}>
          <img src={avatar} alt={channelName} className={styles.avatar} />
          <h2 className={styles['channel-name']}>{channelName}</h2>
          <p className={styles.handle}>@{username}</p>

          {category && (
            <div className={styles.categoryTags}>
              {category.split(',').map((tag: string) => (
                <span key={tag}>#{tag.trim()} </span>
              ))}
            </div>
          )}
        </div>

        <div className={styles['subscriber-chart-wrapper']}>
          <div className={styles['subscriber-chart']}>[구독자수 변동]</div>
        </div>
      </aside>

      <main className={styles['feed-section']}>
        <h2 className={styles['feed-title']}>📨 @{username}의 최근 피드</h2>
        <div className={styles['feed-list']}>
          {posts.map(post => {
            const media = typeof post.media === 'string' ? JSON.parse(post.media) : post.media;
            const safeUrl = media?.url?.replace(/([^:]\/)\/+/g, '$1'); // double slash fix
            return (
              <div
                key={post.id}
                className={styles['feed-card']}
                onClick={() => window.open(`https://t.me/${username}`, '_blank')}
              >
                {media?.type === 'photo' && safeUrl && (
                  <img
                    src={safeUrl}
                    alt="media"
                    className={styles.mediaImage}
                  />
                )}
                <p className={styles['feed-content']}>{post.content || '(내용 없음)'}</p>
                <div className={styles['feed-meta']}>
                  <div className={styles['meta-group']}>
                    <MessageCircle className={styles.icon} />
                    <span>{post.replies ?? 0}</span>
                  </div>
                  <div className={styles['meta-group']}>
                    <Repeat2 className={styles.icon} />
                    <span>{post.forwards ?? 0}</span>
                  </div>
                  <div className={styles['meta-group']}>
                    <Heart className={styles.icon} />
                    <span>{post.views ?? 0}</span>
                  </div>
                  <div className={styles['meta-group']}>
                    <Share2 className={styles.icon} />
                    <span>{new Date(post.posted_at).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            );
          })}
          {loading && <p style={{ color: '#888' }}>불러오는 중...</p>}
        </div>
      </main>
    </div>
  );
};

export default TelegramFeedDetail;
