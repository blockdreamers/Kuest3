import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Twitter, MessageCircle, Send, DollarSign, CheckCircle, Timer, Users, ExternalLink, ArrowLeft, Info } from 'lucide-react';

const QuestParticipants = () => {
  const mockParticipants = [
    { walletAddress: "0x1234...5678", reward: 50, participatedAt: "2025-04-09 16:23" },
    { walletAddress: "0x8765...4321", reward: 35, participatedAt: "2025-04-09 16:20" },
    { walletAddress: "0x9876...1234", reward: 45, participatedAt: "2025-04-09 16:18" }
  ];

  return (
    <div className="mt-6">
      <h3 className="text-lg font-semibold mb-4">참여자 목록</h3>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">지갑 주소</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">보상</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">참여 시간</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {mockParticipants.map((participant, index) => (
              <tr key={index}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{participant.walletAddress}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{participant.reward} USDT</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{participant.participatedAt}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const QuestDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [completedTasks, setCompletedTasks] = useState<string[]>([]);

  const questData = {
    id: 1,
    title: "멀티 플랫폼 미션 참여",
    description: "SNS 활동 미션을 완료하고 보상을 받으세요",
    reward: 50,
    rewardType: "USDT",
    platforms: ["twitter", "telegram", "discord"],
    participants: 567,
    deadline: "2024-03-27T00:00:00Z",
    difficulty: "Medium",
    totalReward: 10000,
    claimedReward: 6500,
    tasks: [
      {
        id: "twitter-follow",
        platform: "twitter",
        title: "트위터 팔로우",
        description: "@CryptoProject 트위터 계정을 팔로우하세요",
        link: "https://twitter.com/CryptoProject"
      },
      {
        id: "twitter-retweet",
        platform: "twitter",
        title: "트윗 리트윗",
        description: "최신 공지 트윗을 리트윗하세요",
        link: "https://twitter.com/CryptoProject/status/123456789"
      },
      {
        id: "telegram-join",
        platform: "telegram",
        title: "텔레그램 참여",
        description: "공식 텔레그램 그룹에 참여하세요",
        link: "https://t.me/CryptoProject"
      },
      {
        id: "discord-join",
        platform: "discord",
        title: "디스코드 참여",
        description: "디스코드 커뮤니티에 참여하세요",
        link: "https://discord.gg/cryptoproject"
      }
    ],
    questGuide: [
      "1. 트위터를 팔로우하면 10포인트를 획득할 수 있어요.",
      "2. 텔레그램 채널에 참여하면 15포인트를 받을 수 있어요.",
      "3. 디스코드에 입장하고 커뮤니티와 대화해보세요! (20포인트)",
      "4. 모든 미션을 완료하면 추가로 5포인트가 지급됩니다."
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
    <div className="max-w-7xl mx-auto px-4 py-8">
      <button
        onClick={() => navigate(-1)}
        className="mb-6 flex items-center text-gray-600 hover:text-blue-600 transition-colors duration-200"
      >
        <ArrowLeft className="h-5 w-5 mr-2" />
        뒤로 가기
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold">{questData.title}</h1>
              <div className="flex items-center space-x-2 text-green-500 font-bold">
                <DollarSign className="h-5 w-5" />
                <span>{questData.reward} {questData.rewardType}</span>
              </div>
            </div>

            <p className="text-gray-600 mb-6">{questData.description}</p>

            <div className="space-y-6">
              {questData.tasks.map((task) => (
                <div
                  key={task.id}
                  className={`border rounded-lg p-4 ${
                    completedTasks.includes(task.id)
                      ? 'bg-green-50 border-green-200'
                      : 'hover:border-blue-300 transition duration-200'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-3">
                      {getPlatformIcon(task.platform)}
                      <div>
                        <h3 className="font-semibold">{task.title}</h3>
                        <p className="text-sm text-gray-600">{task.description}</p>
                      </div>
                    </div>
                    <div>
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
                          className="inline-flex items-center px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700"
                        >
                          미션 완료하기
                          <ExternalLink className="h-4 w-4 ml-1" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 border-t pt-6">
              <div className="flex items-center mb-4">
                <Info className="h-5 w-5 text-blue-600 mr-2" />
                <h2 className="text-lg font-semibold">퀘스트 상세 설명</h2>
              </div>
              <div className="bg-blue-50 rounded-lg p-4 text-sm space-y-2">
                {questData.questGuide.map((item, idx) => (
                  <div key={idx}>{item}</div>
                ))}
              </div>
            </div>

            <div className="mt-8 border-t pt-6">
              <h2 className="text-lg font-semibold mb-4">다른 퀘스트 둘러보기</h2>
              {/* 다른 퀘스트 카드는 그대로 유지 */}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-lg p-6 sticky top-24">
            <h2 className="text-lg font-semibold mb-4">퀘스트 진행 현황</h2>
            <div className="mb-6">
              <div className="flex justify-between text-sm mb-2 text-gray-600">
                <span>총 보상 수량</span>
                <span>{questData.claimedReward} / {questData.totalReward} {questData.rewardType}</span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full">
                <div
                  className="h-2 bg-blue-600 rounded-full"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
            </div>

            <div className="space-y-4 text-sm text-gray-600">
              <div className="flex justify-between items-center">
                <span className="flex items-center"><Users className="h-4 w-4 mr-2" /> 참여자 수</span>
                <span className="font-medium">{questData.participants.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="flex items-center"><Timer className="h-4 w-4 mr-2" /> 마감일</span>
                <span className="font-medium">
                  {new Date(questData.deadline).toLocaleDateString()}
                </span>
              </div>
            </div>

            <button
              className={`w-full mt-6 py-3 px-4 rounded-lg font-medium ${
                completedTasks.length === questData.tasks.length
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
              disabled={completedTasks.length !== questData.tasks.length}
            >
              {completedTasks.length === questData.tasks.length
                ? '보상 클레임하기'
                : `미션 완료 (${completedTasks.length}/${questData.tasks.length})`}
            </button>

            <QuestParticipants />
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestDetail;
