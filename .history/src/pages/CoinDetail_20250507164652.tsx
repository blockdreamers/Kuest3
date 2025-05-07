import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Globe, Twitter, Github, ExternalLink, Star, Vote, ArrowLeft } from 'lucide-react';
import supabase from '../lib/supabase';
import { extractHandleFromTwitterUrl } from '../lib/utils/twitter';
import styles from './CoinDetail.module.css';
import VotingInfoBox from '../components/VotingInfoBox';

async function fetchUSDKRW(): Promise<number> {
  try {
    const res = await fetch('https://api.exchangerate.host/latest?base=USD&symbols=KRW');
    const data = await res.json();
    return data.rates.KRW;
  } catch (err) {
    console.error('환율 불러오기 실패:', err);
    return 1350;
  }
}

function formatPriceKRW(valueUSD: number, rate: number): string {
  const valueKRW = valueUSD * rate;
  if (valueKRW < 10) return `${valueKRW.toFixed(2)} 원`;
  if (valueKRW < 10000) return `${Math.round(valueKRW).toLocaleString()} 원`;
  if (valueKRW < 100000) return `${(Math.round(valueKRW / 10) * 10).toLocaleString()} 원`;
  if (valueKRW < 1000000) return `${(Math.round(valueKRW / 100) * 100).toLocaleString()} 원`;
  return `${(Math.round(valueKRW / 1000) * 1000).toLocaleString()} 원`;
}

function formatMarketCapKRW(valueUSD: number, rate: number): string {
  const valueKRW = valueUSD * rate;
  return `${(valueKRW / 1e8).toFixed(1)} 억원`;
}

function formatVolumeKRW(valueUSD: number, rate: number): string {
  const valueKRW = valueUSD * rate;
  return `${(valueKRW / 1e6).toFixed(1)} 백만원`;
}

const CoinDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [coin, setCoin] = useState<any | null>(null);
  const [exchangeRate, setExchangeRate] = useState<number>(1350);
  const twitterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchUSDKRW().then(setExchangeRate);
  }, []);

  useEffect(() => {
    const fetchCoin = async () => {
      const { data, error } = await supabase
        .from('project_info')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('코인 데이터 조회 실패:', error.message);
        return;
      }
      setCoin(data);
    };

    if (id) fetchCoin();
  }, [id]);

  useEffect(() => {
    const loadTwitterTimeline = async () => {
      if (coin?.twitter && twitterRef.current) {
        const handle = extractHandleFromTwitterUrl(coin.twitter);
        if (!handle) return;

        if (!(window as any).twttr) {
          const script = document.createElement('script');
          script.src = 'https://platform.twitter.com/widgets.js';
          script.async = true;
          document.body.appendChild(script);
          script.onload = () => {
            (window as any).twttr.widgets.createTimeline(
              { sourceType: 'profile', screenName: handle },
              twitterRef.current!,
              { height: 500, theme: 'dark', tweetLimit: 2, chrome: 'noheader nofooter noborders transparent' }
            );
          };
        } else {
          (window as any).twttr.widgets.createTimeline(
            { sourceType: 'profile', screenName: handle },
            twitterRef.current!,
            { height: 500, theme: 'dark', tweetLimit: 2, chrome: 'noheader nofooter noborders transparent' }
          );
        }
      }
    };

    loadTwitterTimeline();
  }, [coin]);

  useEffect(() => {
    if (coin?.tradingview_symbol) {
      const script = document.createElement('script');
      script.src = 'https://s3.tradingview.com/tv.js';
      script.async = true;
      script.onload = () => {
        if ((window as any).TradingView) {
          new (window as any).TradingView.widget({
            autosize: true,
            symbol: coin.tradingview_symbol,
            interval: '60',
            timezone: 'Asia/Seoul',
            theme: 'dark',
            style: '1',
            locale: 'kr',
            container_id: 'tradingview-widget',
            withdateranges: true,
            hide_side_toolbar: false,
            allow_symbol_change: false,
          });
        }
      };
      document.body.appendChild(script);
    }
  }, [coin]);

  if (!coin) {
    return (
      <div className={styles['coin-detail-container']}>
        <button onClick={() => navigate(-1)} className={styles['coin-detail-back-btn']}>
          <ArrowLeft className="h-5 w-5 mr-2" /> 목록으로 돌아가기
        </button>
      </div>
    );
  }

  return (
    <div className={styles['coin-detail-container']}>
      <button onClick={() => navigate(-1)} className={styles['coin-detail-back-btn']}>
        <ArrowLeft className="h-5 w-5 mr-2" /> 목록으로 돌아가기
      </button>

      <div className={styles['coin-detail-layout']}>
        <div className={styles['coin-detail-card']}>
          {/* 코인 관련 정보들 */}
          {/* ... (생략된 내부 콘텐츠는 동일) */}

          {/* 트레이딩뷰 차트 */}
          <h2 className={styles['coin-detail-chart-title']}>트레이딩뷰 차트</h2>
          <div className={styles['coin-detail-tradingview-container']} id="tradingview-widget"></div>
        </div>

        {/* 오른쪽 박스 */}
        <div className={styles['coin-detail-right-box']}>
          <VotingInfoBox coinId={coin.id} coinName={coin.name_ko || coin.name} coinSymbol={coin.symbol} />

          <div className={styles['coin-detail-tweet-head']}>
            <Twitter className="text-blue-400 w-5 h-5" />
            <h2 className="text-lg font-semibold">최신 트윗</h2>
          </div>

          <div ref={twitterRef} className={styles['coin-detail-tweet-container']}></div>

          <button className={styles['coin-detail-vote-btn']}>
            <Vote className="w-5 h-5" />
            <span>투표하러 가기</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CoinDetail;
