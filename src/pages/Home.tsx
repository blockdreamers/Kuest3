// ✅ 전체 home.tsx 파일 (Crypto Projects + 인기 투표 + Ongoing Quests)
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowUp, ArrowDown, Timer, Users, Twitter, MessageCircle, Send,
  DollarSign, Star
} from 'lucide-react';

// 🧩 mockData (생략 가능)
const mockData = [ /* ... 기존 Crypto Projects mock ... */ ];
const mockVotingData = [ /* ... 기존 Voting mock ... */ ];
const mockQuestData = [ /* ... 기존 Quest mock ... */ ];

const CountdownTimer = () => {
  const [timeLeft, setTimeLeft] = useState('');
  const targetDate = new Date('2025-12-31T03:00:00.000Z'); // KST 0시 기준

  useEffect(() => {
    const calculate = () => {
      const now = new Date();
      const diff = targetDate.getTime() - now.getTime();

      if (diff <= 0) {
        setTimeLeft('00:00:00:00');
        return;
      }
      const d = Math.floor(diff / (1000 * 60 * 60 * 24));
      const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const m = Math.floor((diff / 1000 / 60) % 60);
      const s = Math.floor((diff / 1000) % 60);
      setTimeLeft(`${d.toString().padStart(2, '0')}:${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`);
    };
    calculate();
    const timer = setInterval(calculate, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="text-xl text-right font-bold text-blue-600 font-mono">
      {timeLeft}
    </div>
  );
};

const VotingCard = ({ coin, rank }) => (
  <div className="grid grid-cols-8 items-center gap-4 bg-white p-4 rounded-lg shadow hover:shadow-md">
    <div className="font-bold">{rank}</div>
    <img src={coin.logo} alt={coin.name} className="w-10 h-10 rounded-full" />
    <div className="col-span-2">
      <div className="font-medium">{coin.name}</div>
      <div className="text-sm text-gray-500">{coin.symbol}</div>
    </div>
    <div>${(coin.votes * 1000).toLocaleString()}</div>
    <div>${(coin.votes / 100).toFixed(2)}</div>
    <div>{coin.votes.toLocaleString()}</div>
    <button className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700">Vote</button>
  </div>
);

const QuestCard = ({ quest }) => {
  const navigate = useNavigate();
  const getIcon = (p) => p === 'twitter' ? <Twitter className="h-4 w-4 text-blue-400" /> :
    p === 'discord' ? <MessageCircle className="h-4 w-4 text-indigo-400" /> :
    p === 'telegram' ? <Send className="h-4 w-4 text-sky-400" /> : null;

  const color = {
    easy: 'bg-green-100 text-green-800',
    medium: 'bg-yellow-100 text-yellow-800',
    hard: 'bg-red-100 text-red-800'
  }[quest.difficulty.toLowerCase()] || 'bg-gray-100 text-gray-800';

  return (
    <div
      className="cursor-pointer bg-white rounded-xl shadow-md p-6 hover:shadow-lg"
      onClick={() => navigate(`/quest/${quest.id}`)}
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">{quest.title}</h3>
          <p className="text-sm text-gray-600 line-clamp-2">{quest.description}</p>
        </div>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${color}`}>{quest.difficulty}</span>
      </div>
      <div className="flex justify-between mb-4">
        <div className="flex space-x-2">
          {quest.platforms.map((p, i) => (
            <div key={i} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
              {getIcon(p)}
            </div>
          ))}
        </div>
        <div className="flex items-center space-x-1 text-green-500">
          <DollarSign className="h-4 w-4" />
          <span className="font-semibold">{quest.reward} {quest.rewardType}</span>
        </div>
      </div>
      <div className="flex justify-between text-sm text-gray-500">
        <div className="flex items-center space-x-1"><Users className="w-4 h-4" /><span>{quest.participants.toLocaleString()}</span></div>
        <div className="flex items-center space-x-1"><Timer className="w-4 h-4" /><span>{new Date(quest.deadline).toLocaleDateString()}</span></div>
      </div>
    </div>
  );
};

const Home = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-16">

      {/* 🔹 인기 투표 */}
      <section>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">인기 투표</h2>
          <CountdownTimer />
        </div>
        <div className="space-y-4 max-h-[600px] overflow-y-auto">
          {mockVotingData.slice(0, 10).map((coin, i) => (
            <VotingCard key={coin.id} coin={coin} rank={i + 1} />
          ))}
        </div>
      </section>

      {/* 🔹 Crypto Projects */}
      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Crypto Projects</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {mockData.map((coin) => (
            <Link
              key={coin.id}
              to={`/coin/${coin.id}`}
              className="bg-white p-4 rounded-lg shadow hover:shadow-md"
            >
              <div className="flex space-x-3 items-center mb-2">
                <img src={coin.logo} className="w-10 h-10" />
                <div>
                  <div className="font-semibold">{coin.name}</div>
                  <div className="text-sm text-gray-500">{coin.symbol}</div>
                </div>
              </div>
              <div className="text-gray-800 text-sm">
                Price: ${coin.price.toLocaleString()}<br />
                Market Cap: ${(coin.marketCap / 1e9).toFixed(1)}B
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 🔹 Ongoing Quests */}
      <section>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Ongoing Quests</h2>
          <div className="flex items-center text-sm text-gray-500 space-x-2">
            <Timer className="w-4 h-4" />
            <span>Updated daily</span>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockQuestData.map((quest) => (
            <QuestCard key={quest.id} quest={quest} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
