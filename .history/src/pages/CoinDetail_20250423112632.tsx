import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Globe,
  MessageCircle,
  Twitter,
  Github,
  ExternalLink,
  Star,
  Vote,
  ArrowLeft
} from 'lucide-react';
import './CoinDetail.css'; // ✨ 스타일 파일 연결

const CoinDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const coinData = {
    name: 'Bitcoin',
    symbol: 'BTC',
    price: 65432.10,
    priceChange24h: -5.31,
    marketCap: 1284567890123,
    circulatingSupply: 19.84,
    maxSupply: 21,
    fdv: 2.33,
    volume24h: 72.92,
    volumeMarketCap: 3.25,
    profileScore: 100,
    rating: 4.6,
    description:
      'Bitcoin은 2009년 Satoshi Nakamoto라는 이름을 사용한 익명의 개발자(또는 그룹)가 만든 최초의 분산형 암호화폐입니다.',
    links: {
      website: 'https://bitcoin.org',
      discord: 'https://discord.gg/bitcoin',
      telegram: 'https://t.me/bitcoin',
      twitter: 'https://twitter.com/bitcoin',
      reddit: 'https://reddit.com/r/bitcoin',
      github: 'https://github.com/bitcoin',
      whitepaper: 'https://bitcoin.org/bitcoin.pdf'
    }
  };

  return (
    <div className="coin-detail-container">
      <button onClick={() => navigate(-1)} className="back-button">
        <ArrowLeft className="h-5 w-5 mr-2" />
        목록으로 돌아가기
      </button>

      <div className="coin-detail-grid">
        {/* 왼쪽 영역 */}
        <div className="coin-left">
          <div className="coin-box">
            <div className="coin-header">
              <div className="coin-info">
                <img
                  src={`https://assets.coingecko.com/coins/images/1/large/bitcoin.png`}
                  alt={coinData.name}
                  className="coin-logo"
                />
                <div>
                  <h1 className="coin-name">
                    {coinData.name}
                    <span className="coin-symbol">{coinData.symbol}</span>
                  </h1>
                  <div className="coin-rank">
                    <Star className="star-icon" />
                    <span className="rank-label">랭킹 1위</span>
                  </div>
                </div>
              </div>
              <div className="coin-price-box">
                <p className="coin-price">₩{coinData.price.toLocaleString()}</p>
                <p className="coin-change">{coinData.priceChange24h}% (24시간)</p>
              </div>
            </div>

            <div className="coin-stats">
              <div className="stat-group">
                <div>
                  <p className="stat-label">시가총액</p>
                  <p className="stat-value">₩{coinData.marketCap.toLocaleString()}</p>
                </div>
                <div>
                  <p className="stat-label">FDV</p>
                  <p className="stat-value">₩{coinData.fdv}P</p>
                </div>
                <div>
                  <p className="stat-label">유통량</p>
                  <p className="stat-value">{coinData.circulatingSupply}M BTC</p>
                </div>
              </div>
              <div className="stat-group">
                <div>
                  <p className="stat-label">24시간 거래량</p>
                  <p className="stat-value">₩{coinData.volume24h}T</p>
                </div>
                <div>
                  <p className="stat-label">거래량/시총</p>
                  <p className="stat-value">{coinData.volumeMarketCap}%</p>
                </div>
                <div>
                  <p className="stat-label">최대 발행량</p>
                  <p className="stat-value">{coinData.maxSupply}M BTC</p>
                </div>
              </div>
            </div>

            <div className="profile-score">
              <h2 className="section-title">프로필 점수</h2>
              <div className="score-bar">
                <div
                  className="score-filled"
                  style={{ width: `${coinData.profileScore}%` }}
                ></div>
              </div>
              <p className="score-label">{coinData.profileScore}%</p>
            </div>

            <div className="coin-links">
              <h2 className="section-title">관련 링크</h2>
              <div className="links-grid">
                <a href={coinData.links.website} target="_blank" rel="noopener noreferrer">
                  <Globe className="link-icon" />
                  <span>공식 홈페이지</span>
                </a>
                <a href={coinData.links.whitepaper} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="link-icon" />
                  <span>백서</span>
                </a>
                <a href={coinData.links.github} target="_blank" rel="noopener noreferrer">
                  <Github className="link-icon" />
                  <span>GitHub</span>
                </a>
                <a href={coinData.links.twitter} target="_blank" rel="noopener noreferrer">
                  <Twitter className="link-icon" />
                  <span>Twitter</span>
                </a>
              </div>
            </div>

            <div className="coin-description">
              <h2 className="section-title">{coinData.name} 소개</h2>
              <p className="description-text">{coinData.description}</p>
            </div>
          </div>
        </div>

        {/* 오른쪽 영역 */}
        <div className="coin-right">
          <div className="twitter-box">
            <div className="twitter-header">
              <Twitter className="text-blue-400 w-5 h-5" />
              <h2 className="text-lg font-semibold">최신 트윗</h2>
            </div>
            <div className="tweet-placeholder">
              <p className="text-gray-500 text-sm mb-2">트윗을 불러오는 중입니다...</p>
            </div>

            <button className="vote-button">
              <Vote className="w-5 h-5" />
              <span>투표하러 가기</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoinDetail;
