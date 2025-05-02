import React, { useState, useEffect } from 'react';
import { votingInfo } from '../lib/data/votingInfo';
import './VotingStatus.css';

const VotingCard = ({ coin, rank }) => {
  return (
    <div
      className="voting-card flex items-center justify-between px-4 py-2"
    >
      <div className="flex items-center space-x-4">
        <div className="voting-rank">{rank}</div>
        <img
          src={coin.logo}
          alt={coin.name}
          className="voting-coin-logo"
        />
        <div>
          <div className="voting-name">{coin.name}</div>
          <div className="voting-symbol">{coin.symbol}</div>
        </div>
      </div>

      <div className="flex items-center space-x-8">
        <div className="text-right">
          <p className="vote-stat-label">시가총액</p>
          <p className="vote-stat-value">${(coin.votes * 1000).toLocaleString()}</p>
        </div>
        <div className="text-right">
          <p className="vote-stat-label">가격</p>
          <p className="vote-stat-value">${(coin.votes / 100).toFixed(2)}</p>
        </div>
        <div className="text-right">
          <p className="vote-stat-label">총 투표수</p>
          <p className="vote-stat-value">{coin.votes.toLocaleString()}</p>
        </div>
        <button className="vote-button">투표하기</button>
      </div>
    </div>
  );
};

const CountdownTimer = () => {
  const [timeLeft, setTimeLeft] = useState('');
  const targetDate = new Date('2025-12-31T03:00:00.000Z');

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const difference = targetDate.getTime() - now.getTime();

      if (difference <= 0) {
        setTimeLeft('00:00:00:00');
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((difference / 1000 / 60) % 60);
      const seconds = Math.floor((difference / 1000) % 60);

      setTimeLeft(
        `${days.toString().padStart(2, '0')}:${hours.toString().padStart(2, '0')}:${minutes
          .toString()
          .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
      );
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="font-mono text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">
      {timeLeft}
    </div>
  );
};

const VotingStatus = () => {
  return (
    <div className="mb-16">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">인기 투표</h1>
        <CountdownTimer />
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="space-y-3 max-h-[600px] overflow-y-auto">
          {votingInfo.slice(0, 10).map((coin, index) => (
            <VotingCard key={coin.id} coin={coin} rank={index + 1} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default VotingStatus;
