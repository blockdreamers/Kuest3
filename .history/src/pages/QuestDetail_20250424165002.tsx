// src/pages/QuestDetail.tsx

import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Twitter, MessageCircle, Send, DollarSign, CheckCircle,
  Timer, Users, ExternalLink, ArrowLeft, Info
} from 'lucide-react';
import styles from './QuestDetail.module.css';

const QuestDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [completedTasks, setCompletedTasks] = useState<string[]>([]);

  const questData = {
    title: "멀티 플랫폼 참여 미션",
    description: "소셜 미디어 활동을 완료하고 리워드를 받아보세요.",
    reward: 50,
    rewardType: "USDT",
    platforms: ["twitter", "telegram", "discord"],
    participantsCount: 567,
    deadline: "2024-03-27T00:00:00Z",
    totalReward: 10000,
    claimedReward: 6500,
    questGuide: [
      "1. 트위터 계정을 팔로우하고 10포인트를 받으세요!",
      "2. 공식 텔레그램 채널에 참여하고 15포인트를 받으세요!",
      "3. 디스코드 서버에 참여하고 커뮤니티와 소통하세요! (20포인트)",
      "4. 모든 미션을 완료하면 추가 보너스 5포인트가 지급됩니다!"
    ],
    tasks: [
      {
        id: "twitter-follow",
        platform: "twitter",
        title: "트위터 팔로우",
        description: "@CryptoProject 계정을 팔로우하세요.",
        link: "https://twitter.com/CryptoProject"
      },
      {
        id: "twitter-retweet",
        platform: "twitter",
        title: "공지 리트윗",
        description: "최신 공지를 리트윗하세요.",
        link: "https://twitter.com/CryptoProject/status/123456789"
      },
      {
        id: "telegram-join",
        platform: "telegram",
        title: "텔레그램 참여",
        description: "공식 텔레그램 그룹에 참여하세요.",
        link: "https://t.me/CryptoProject"
      },
      {
        id: "discord-join",
        platform: "discord",
        title: "디스코드 참여",
        description: "디스코드 커뮤니티에 참여하세요.",
        link: "https://discord.gg/cryptoproject"
      }
    ],
    participants: [
      { walletAddress: "0x1234...5678", reward: 50, participatedAt: "2025-04-09 16:23" },
      { walletAddress: "0x8765...4321", reward: 35, participatedAt: "2025-04-09 16:20" },
      { walletAddress: "0x9876...1234", reward: 45, participatedAt: "2025-04-09 16:18" }
    ]
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'twitter': return <Twitter className="h-5 w-5 text-blue-400" />;
      case 'telegram': return <Send className="h-5 w-5 text-sky-400" />;
      case 'discord': return <MessageCircle className="h-5 w-5 text-indigo-400" />;
      default: return null;
    }
  };

  const handleTaskComplete = (taskId: string) => {
    setCompletedTasks(prev => [...prev, taskId]);
  };

  const progressPercentage = (questData.claimedReward / questData.totalReward) * 100;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 font-['Pretendard','Montserrat',sans-serif]">
      <button onClick={() => navigate(-1)} className="mb-6 flex items-center text-gray-600 hover:text-blue-600">
        <ArrowLeft className="h-5 w-5 mr-2" />
        뒤로 가기
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* 본문 왼쪽 */}
        <div className="lg:col-span-2">
          <div className="space-y-6">
            {questData.tasks.map((task) => (
              <div key={task.id} className={styles.questBox}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {getPlatformIcon(task.platform)}
                    <div>
                      <h3 className="font-semibold text-white">{task.title}</h3>
                      <p className="text-sm text-gray-400">{task.description}</p>
                    </div>
                  </div>
                  {completedTasks.includes(task.id) ? (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                      <CheckCircle className="h-4 w-4 mr-1" />
                      완료됨
                    </span>
                  ) : (
                    <a
                      href={task.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => handleTaskComplete(task.id)}
                      className={styles.taskButton}
                    >
                      
                      퀘스트 완료하기 <ExternalLink className="h-4 w-4 ml-1" />
                    </span>
                  </a>
                  )}
                </div>
              </div>
            ))}

            <div className="mt-8 border-t pt-6">
              <div className="flex items-center space-x-2 mb-4">
                <Info className="h-5 w-5 text-blue-600" />
                <h2 className={styles.sectionTitle}>퀘스트 상세 설명</h2>
              </div>
              <div className={styles.guideBox}>
                <ul className="space-y-2">
                  {questData.questGuide.map((g, i) => (
                    <li key={i} className="text-sm text-gray-700 flex items-start">
                      <span className="mr-2">•</span>{g}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* 사이드 바 */}
        <div className="lg:col-span-1 space-y-6">
          <div className={`${styles.questBox}`}>
            <h2 className={styles.sectionTitle}>퀘스트 현황</h2>
            <div className="mb-4">
              <div className="flex justify-between text-sm text-gray-400 mb-1">
                <span>총 리워드</span>
                <span>{questData.claimedReward}/{questData.totalReward} {questData.rewardType}</span>
              </div>
              <div className={styles.progressTrack}>
                <div className={styles.progressBar} style={{ width: `${progressPercentage}%` }} />
              </div>
            </div>
            <div className="space-y-2 text-sm text-gray-400">
              <div className="flex justify-between">
                <span><Users className="inline h-4 w-4 mr-1" />참여자 수</span>
                <span>{questData.participantsCount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span><Timer className="inline h-4 w-4 mr-1" />마감일</span>
                <span>{new Date(questData.deadline).toLocaleDateString()}</span>
              </div>
            </div>
            <button
              disabled={completedTasks.length !== questData.tasks.length}
              className={`w-full mt-6 py-3 px-4 rounded-lg font-medium ${
                completedTasks.length === questData.tasks.length
                  ? styles.claimButtonActive
                  : styles.claimButtonInactive
              }`}
            >
              {completedTasks.length === questData.tasks.length
                ? '리워드 받기'
                : `모든 미션 완료 (${completedTasks.length}/${questData.tasks.length})`}
            </button>
          </div>

          <div className={styles.questBox}>
            <h2 className={styles.sectionTitle}>참여자 목록</h2>
            <div className="overflow-x-auto">
              <table className="w-full table-auto text-sm participantTable">
                <thead>
                  <tr>
                    <th className="px-3 py-2 text-left">지갑 주소</th>
                    <th className="px-3 py-2 text-left">리워드</th>
                    <th className="px-3 py-2 text-left">참여 시각</th>
                  </tr>
                </thead>
                <tbody>
                  {questData.participants.map((p, i) => (
                    <tr key={i}>
                      <td className="px-3 py-2">{p.walletAddress}</td>
                      <td className="px-3 py-2">{p.reward} USDT</td>
                      <td className="px-3 py-2">{p.participatedAt}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestDetail;
