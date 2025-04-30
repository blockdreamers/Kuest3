// src/components/OngoingQuests.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Timer, Users, Twitter, MessageCircle, Send, DollarSign } from 'lucide-react';
import { ongoingQuestInfo } from '../lib/data/ongoingQuestInfo'; // ✅ 경로 및 이름 정확히
import './OngoingQuests.css';

const QuestCard = ({ quest }) => {
  const navigate = useNavigate();

  const getPlatformIcon = (platform) => {
    switch (platform) {
      case 'twitter': return <Twitter className="h-4 w-4 text-blue-400" />;
      case 'discord': return <MessageCircle className="h-4 w-4 text-indigo-400" />;
      case 'telegram': return <Send className="h-4 w-4 text-sky-400" />;
      default: return null;
    }
  };

  const getDifficultyBadgeClass = (difficulty) => {
    switch (difficulty.toLowerCase()) {
      case 'easy': return 'difficulty-badge difficulty-easy';
      case 'medium': return 'difficulty-badge difficulty-medium';
      case 'hard': return 'difficulty-badge difficulty-hard';
      default: return 'difficulty-badge';
    }
  };

  const getDifficultyText = (difficulty) => {
    switch (difficulty.toLowerCase()) {
      case 'easy': return '쉬움';
      case 'medium': return '보통';
      case 'hard': return '어려움';
      default: return difficulty;
    }
  };

  return (
    <div className="quest-box relative" onClick={() => navigate(`/quest/${quest.id}`)}>
      {/* 난이도 배지 */}
      <span
        className={getDifficultyBadgeClass(quest.difficulty)}
        data-tooltip={getDifficultyText(quest.difficulty)}
      >
        ✓
      </span>

      <div className="p-4">
        <div className="flex justify-between items-start mb-3">
          <div>
            <h3 className="text-lg font-semibold text-white mb-1">{quest.title}</h3>
            <p className="text-sm text-gray-400 quest-description">{quest.description}</p>
          </div>
        </div>

        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            {quest.platforms.map((platform, index) => (
              <div key={index} className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center">
                {getPlatformIcon(platform)}
              </div>
            ))}
          </div>
          <div className="flex items-center space-x-1 text-green-400">
            <DollarSign className="h-4 w-4" />
            <span className="font-semibold">{quest.reward} {quest.rewardType}</span>
          </div>
        </div>

        <div className="flex items-center justify-between text-sm text-gray-400">
          <div className="flex items-center space-x-1">
            <Users className="h-4 w-4" />
            <span>{quest.participants.toLocaleString()}명 참여</span>
          </div>
          <div className="flex items-center space-x-1">
            <Timer className="h-4 w-4" />
            <span>{new Date(quest.deadline).toLocaleDateString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const OngoingQuests = () => {
  return (
    <div className="mt-16">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">💎에어드롭 퀘스트</h1>
        <div className="flex items-center space-x-2 text-sm text-gray-400">
          <Timer className="w-4 h-4" />
          <span>매일 업데이트</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {ongoingQuestInfo.map((quest) => (
          <QuestCard key={quest.id} quest={quest} />
        ))}
      </div>
    </div>
  );
};

export default OngoingQuests;
