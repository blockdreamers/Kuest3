// src/components/OngoingQuests.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Timer, Users, Twitter, MessageCircle, Send, DollarSign } from 'lucide-react';
import { ongoingQuestInfo } from '../lib/data/ongoingQuestInfo'; // ✅ 정확한 파일명 일치
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

  const getDifficultyColor = (difficulty) => {
    switch (difficulty.toLowerCase()) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
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
    <div className="quest-box" onClick={() => navigate(`/quest/${quest.id}`)}>
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-lg font-semibold text-white mb-1">{quest.title}</h3>
            <p className="text-sm text-gray-400 line-clamp-2">{quest.description}</p>
          </div>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(quest.difficulty)}`}>
            {getDifficultyText(quest.difficulty)}
          </span>
        </div>

        <div className="flex items-center justify-between mb-4">
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
        <h1 className="text-2xl font-bold text-black">💎에어드롭 퀘스트</h1>
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
