import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Twitter, MessageCircle, Send, DollarSign, CheckCircle, Timer, Users, ExternalLink, ArrowLeft, ArrowRight, Info } from 'lucide-react';

const QuestParticipants = () => {
  const mockParticipants = [
    {
      walletAddress: "0x1234...5678",
      reward: 50,
      participatedAt: "2025-04-09 16:23"
    },
    {
      walletAddress: "0x8765...4321",
      reward: 35,
      participatedAt: "2025-04-09 16:20"
    },
    {
      walletAddress: "0x9876...1234",
      reward: 45,
      participatedAt: "2025-04-09 16:18"
    }
  ];

  return (
    <div className="mt-6">
      <h3 className="text-lg font-semibold mb-4">Participants</h3>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Wallet Address</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reward</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Participated At</th>
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

// Mock data for related quests
const relatedQuests = [
  {
    id: 2,
    title: "Discord Community Engagement",
    description: "Join our Discord server and participate in technical discussions",
    reward: 15,
    rewardType: "USDC",
    platforms: ["discord"],
    participants: 856,
    deadline: "2024-03-26T00:00:00Z",
    difficulty: "Easy"
  },
  {
    id: 3,
    title: "Multi-Platform Ambassador",
    description: "Create and share content about our latest features across multiple platforms",
    reward: 50,
    rewardType: "USDT",
    platforms: ["twitter", "telegram"],
    participants: 567,
    deadline: "2024-03-27T00:00:00Z",
    difficulty: "Medium"
  },
  {
    id: 4,
    title: "Technical Documentation",
    description: "Help improve our technical documentation and tutorials",
    reward: 100,
    rewardType: "USDC",
    platforms: ["discord"],
    participants: 234,
    deadline: "2024-03-28T00:00:00Z",
    difficulty: "Hard"
  },
  {
    id: 5,
    title: "Community Support",
    description: "Provide support to new users in our Telegram group",
    reward: 20,
    rewardType: "USDT",
    platforms: ["telegram"],
    participants: 1567,
    deadline: "2024-03-29T00:00:00Z",
    difficulty: "Easy"
  }
];

const QuestDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [completedTasks, setCompletedTasks] = useState<string[]>([]);

  // Mock data - would be fetched from API in production
  const questData = {
    id: 1,
    title: "Multi-Platform Engagement",
    description: "Complete social media tasks to earn rewards",
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
        title: "Follow on Twitter",
        description: "Follow @CryptoProject on Twitter",
        link: "https://twitter.com/CryptoProject"
      },
      {
        id: "twitter-retweet",
        platform: "twitter",
        title: "Retweet Announcement",
        description: "Retweet our latest announcement",
        link: "https://twitter.com/CryptoProject/status/123456789"
      },
      {
        id: "telegram-join",
        platform: "telegram",
        title: "Join Telegram Group",
        description: "Join our official Telegram group",
        link: "https://t.me/CryptoProject"
      },
      {
        id: "discord-join",
        platform: "discord",
        title: "Join Discord Server",
        description: "Join our Discord community",
        link: "https://discord.gg/cryptoproject"
      }
    ],
    questGuide: [
      "1. 트위터 계정을 팔로우하고 10포인트를 받으세요!",
      "2. 공식 텔레그램 채널에 참여하고 15포인트를 받으세요!",
      "3. 디스코드 서버에 참여하고 커뮤니티와 소통하세요! (20포인트)",
      "4. 모든 미션을 완료하면 추가 보너스 5포인트가 지급됩니다!"
    ]
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'twitter':
        return <Twitter className="h-5 w-5 text-blue-400" />;
      case 'telegram':
        return <Send className="h-5 w-5 text-sky-400" />;
      case 'discord':
        return <MessageCircle className="h-5 w-5 text-indigo-400" />;
      default:
        return null;
    }
  };

  const handleTaskComplete = (taskId: string) => {
    setCompletedTasks(prev => [...prev, taskId]);
  };

  const progressPercentage = (questData.claimedReward / questData.totalReward) * 100;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="mb-6 flex items-center text-gray-600 hover:text-blue-600 transition-colors duration-200"
      >
        <ArrowLeft className="h-5 w-5 mr-2" />
        뒤로 가기
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold text-gray-900">{questData.title}</h1>
              <div className="flex items-center space-x-2">
                <DollarSign className="h-5 w-5 text-green-500" />
                <span className="text-xl font-bold text-green-500">
                  {questData.reward} {questData.rewardType}
                </span>
              </div>
            </div>

            <p className="text-gray-600 mb-8">{questData.description}</p>

            <div className="space-y-6">
              {questData.tasks.map((task) => (
                <div
                  key={task.id}
                  className={`border rounded-lg p-4 ${
                    completedTasks.includes(task.id)
                      ? 'bg-green-50 border-green-200'
                      : 'hover:border-blue-300 transition-colors duration-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {getPlatformIcon(task.platform)}
                      <div>
                        <h3 className="font-semibold text-gray-900">{task.title}</h3>
                        <p className="text-sm text-gray-600">{task.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      {completedTasks.includes(task.id) ? (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Completed
                        </span>
                      ) : (
                        <a
                          href={task.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => handleTaskComplete(task.id)}
                          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          Complete Task
                          <ExternalLink className="h-4 w-4 ml-1" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Quest Guide Section */}
            <div className="mt-8 border-t pt-6">
              <div className="flex items-center space-x-2 mb-4">
                <Info className="h-5 w-5 text-blue-600" />
                <h2 className="text-lg font-semibold text-gray-900">퀘스트 상세 설명</h2>
              </div>
              <div className="bg-blue-50 rounded-lg p-4">
                <ul className="space-y-2">
                  {questData.questGuide.map((guide, index) => (
                    <li key={index} className="text-gray-700 flex items-start">
                      <span className="mr-2">•</span>
                      {guide}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Related Quests Section */}
            <div className="mt-8 border-t pt-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">다른 퀘스트 둘러보기</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {relatedQuests.slice(0, 4).map((quest) => (
                  <Link
                    key={quest.id}
                    to={`/quest/${quest.id}`}
                    className="block bg-white border rounded-lg p-4 hover:shadow-md transition-all duration-200"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-gray-900">{quest.title}</h3>
                        <p className="text-sm text-gray-600 mt-1 line-clamp-2">{quest.description}</p>
                        <div className="flex items-center mt-2 text-sm text-gray-500">
                          <Users className="h-4 w-4 mr-1" />
                          <span>{quest.participants} participants</span>
                        </div>
                      </div>
                      <div className="flex items-center text-green-500 font-medium">
                        <DollarSign className="h-4 w-4 mr-1" />
                        <span>{quest.reward} {quest.rewardType}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-lg p-6 sticky top-24">
            <h2 className="text-lg font-semibold mb-4">Quest Progress</h2>
            
            {/* Reward Progress */}
            <div className="mb-6">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Total Reward Pool</span>
                <span>{questData.claimedReward}/{questData.totalReward} {questData.rewardType}</span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full">
                <div
                  className="h-2 bg-blue-600 rounded-full"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
            </div>

            {/* Quest Info */}
            <div className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center text-gray-600">
                  <Users className="h-4 w-4 mr-2" />
                  <span>Participants</span>
                </div>
                <span className="font-medium">{questData.participants.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center text-gray-600">
                  <Timer className="h-4 w-4 mr-2" />
                  <span>Deadline</span>
                </div>
                <span className="font-medium">
                  {new Date(questData.deadline).toLocaleDateString()}
                </span>
              </div>
            </div>

            {/* Claim Button */}
            <button
              className={`w-full mt-6 py-3 px-4 rounded-lg font-medium ${
                completedTasks.length === questData.tasks.length
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
              disabled={completedTasks.length !== questData.tasks.length}
            >
              {completedTasks.length === questData.tasks.length ? (
                'Claim Reward'
              ) : (
                `Complete all tasks (${completedTasks.length}/${questData.tasks.length})`
              )}
            </button>

            {/* Add Participants List */}
            <QuestParticipants />
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestDetail;