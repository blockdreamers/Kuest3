import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Globe,
  Twitter,
  Github,
  ExternalLink,
  Star,
  Vote,
  ArrowLeft
} from 'lucide-react';
import supabase from '../lib/supabase';
import styles from './CoinDetail.module.css';

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
  return `${Math.round(valueKRW).toLocaleString()} 원`;
}

function formatMarketCapKRW(valueUSD: number, rate: number): string {
  const valueKRW = valueUSD * rate;
  return `${Math.round(valueKRW).toLocaleString()}`;
}

function formatVolumeKRW(valueUSD: number, rate: number): string {
  const valueKRW = valueUSD * rate;
  return `₩${Math.round(valueKRW).toLocaleString()}`;
}

const CoinDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [coin, setCoin] = useState<any | null>(null);
  const [exchangeRate, setExchangeRate] = useState<number>(1350);

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

  if (!coin) {
    return (
      <div className={styles['coin-detail-container']}>
        <button onClick={() => navigate(-1)} className={styles['coin-detail-back-btn']}>
          <ArrowLeft className="h-5 w-5 mr-2" /> 목록으로 돌아가기
        </button>
        <p className="text-red-500">해당 코인 정보를 찾을 수 없습니다.</p>
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
          <div className={styles['coin-detail-top']}>
            <div className={styles['coin-detail-info-box']}>
              <img src={coin.logo} alt={coin.name} className={styles['coin-detail-logo']} />
              <div>
                <h1 className={styles['coin-detail-title']}>
                  {coin.name_ko || coin.name} <span className={styles['coin-detail-ticker']}>{coin.symbol}</span>
                </h1>
                <div className={styles['coin-detail-rank']}>
                  <Star className={styles['coin-detail-star']} />
                  <span className={styles['coin-detail-rank-text']}>랭킹 1위</span>
                </div>
              </div>
            </div>

            <div className={styles['coin-detail-price-box']}>
              <p className={styles['coin-detail-price']}>{formatPriceKRW(coin.price, exchangeRate)}</p>
              <p
                className={`${styles['coin-detail-diff']} ${
                  coin.price_change >= 0 ? styles['up'] : styles['down']
                }`}
              >
                {coin.price_change >= 0 ? '+' : ''}{coin.price_change.toFixed(2)}% (24시간)
              </p>
            </div>
          </div>

          <div className={styles['coin-detail-stats-block']}>
            <div className={styles['coin-detail-stats-col']}>
              <div>
                <p className={styles['coin-detail-label']}>시가총액</p>
                <p className={styles['coin-detail-value']}>{formatMarketCapKRW(coin.market_cap, exchangeRate)}</p>
              </div>
              <div>
                <p className={styles['coin-detail-label']}>FDV</p>
                <p className={styles['coin-detail-value']}>{formatMarketCapKRW(coin.fdv, exchangeRate)}</p>
              </div>
              <div>
                <p className={styles['coin-detail-label']}>유통량</p>
                <p className={styles['coin-detail-value']}>{Number(coin.circulating_supply).toLocaleString()} {coin.symbol}</p>
              </div>
            </div>

            <div className={styles['coin-detail-stats-col']}>
              <div>
                <p className={styles['coin-detail-label']}>24시간 거래량</p>
                <p className={styles['coin-detail-value']}>{formatVolumeKRW(coin.volume, exchangeRate)}</p>
              </div>
              <div>
                <p className={styles['coin-detail-label']}>시가총액</p>
                <p className={styles['coin-detail-value']}>{formatMarketCapKRW(coin.market_cap, exchangeRate)}</p>
              </div>
              <div>
                <p className={styles['coin-detail-label']}>최대 발행량</p>
                <p className={styles['coin-detail-value']}>{Number(coin.max_supply).toLocaleString()} {coin.symbol}</p>
              </div>
            </div>
          </div>

          <div className={styles['coin-detail-score-section']}>
            <h2 className={styles['coin-detail-subtitle']}>프로필 점수</h2>
            <div className={styles['coin-detail-bar']}>
              <div
                className={styles['coin-detail-bar-fill']}
                style={{ width: `${coin.profile_score}%` }}
              ></div>
            </div>
            <p className={styles['coin-detail-bar-label']}>{coin.profile_score}%</p>
          </div>

          <div className={styles['coin-detail-links-section']}>
            <h2 className={styles['coin-detail-subtitle']}>관련 링크</h2>
            <div className={styles['coin-detail-link-grid']}>
              <a href={coin.website} target="_blank" rel="noopener noreferrer">
                <Globe className={styles['coin-detail-icon']} /> <span>공식 홈페이지</span>
              </a>
              <a href={coin.whitepaper} target="_blank" rel="noopener noreferrer">
                <ExternalLink className={styles['coin-detail-icon']} /> <span>백서</span>
              </a>
              <a href={coin.github} target="_blank" rel="noopener noreferrer">
                <Github className={styles['coin-detail-icon']} /> <span>GitHub</span>
              </a>
              <a href={coin.twitter} target="_blank" rel="noopener noreferrer">
                <Twitter className={styles['coin-detail-icon']} /> <span>Twitter</span>
              </a>
            </div>
          </div>

          <div className={styles['coin-detail-desc']}>
            <h2 className={styles['coin-detail-subtitle']}>{coin.name_ko || coin.name} 소개</h2>
            <p className={styles['coin-detail-text']}>{coin.description}</p>
          </div>
        </div>

        <div className={styles['coin-detail-right-box']}>
          <div className={styles['coin-detail-tweet-head']}>
            <Twitter className="text-blue-400 w-5 h-5" />
            <h2 className="text-lg font-semibold">최신 트윗</h2>
          </div>
          <div className={styles['coin-detail-tweet-loading']}>
            <p className="text-gray-500 text-sm mb-2">트윗을 불러오는 중입니다...</p>
          </div>

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