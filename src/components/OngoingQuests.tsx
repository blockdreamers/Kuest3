import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Timer, Users, Twitter, MessageCircle, Send, DollarSign } from 'lucide-react';

const mockQuestData = [
  {
    id: 1,
    title: "트위터 팔로우 & 리트윗 이벤트",
    description: "공식 트위터 계정을 팔로우하고 최신 프로토콜 업데이트 관련 핀 게시물을 리트윗하세요",
    reward: 25,
    rewardType: "USDT",
    platforms: ["twitter"],
    participants: 1234,
    deadline: "2024-03-25T00:00:00Z",
    difficulty: "Easy"
  },
  {
    id: 2,
    title: "디스코드 커뮤니티 참여",
    description: "디스코드 서버에 참여하고 기술 토론에 참여하세요",
    reward: 15,
    rewardType: "USDC",
    platforms: ["discord"],
    participants: 856,
    deadline: "2024-03-26T00:00:00Z",
    difficulty: "Easy"
  },
  {
    id: 3,
    title: "멀티플랫폼 홍보대사",
    description: "여러 플랫폼에서 우리의 최신 기능에 대한 콘텐츠를 제작하고 공유하세요",
    reward: 50,
    rewardType: "USDT",
    platforms: ["twitter", "telegram"],
    participants: 567,
    deadline: "2024-03-27T00:00:00Z",
    difficulty: "Medium"
  },
  {
    id: 4,
    title: "기술 문서 작성",
    description: "기술 문서와 튜토리얼 개선에 참여하세요",
    reward: 100,
    rewardType: "USDC",
    platforms: ["discord"],
    participants: 234,
    deadline: "2024-03-28T00:00:00Z",
    difficulty: "Hard"
  },
  {
    id: 5,
    title: "커뮤니티 서포터",
    description: "텔레그램 그룹에서 신규 사용자 지원에 참여하세요",
    reward: 20,
    rewardType: "USDT",
    platforms: ["telegram"],
    participants: 1567,
    deadline: "2024-03-29T00:00:00Z",
    difficulty: "Easy"
  },
  {
    id: 6,
    title: "버그 바운티 프로그램",
    description: "스마트 컨트랙트의 보안 취약점을 찾아 리포트하세요",
    reward: 500,
    rewardType: "USDC",
    platforms: ["discord"],
    participants: 89,
    deadline: "2024-03-30T00:00:00Z",
    difficulty: "Hard"
  },
  {
    id: 7,
    title: "밈 콘테스트",
    description: "프로젝트에 대한 독창적인 밈을 제작하고 공유하세요",
    reward: 30,
    rewardType: "USDT",
    platforms: ["twitter", "discord"],
    participants: 2345,
    deadline: "2024-03-31T00:00:00Z",
    difficulty: "Easy"
  },
  {
    id: 8,
    title: "거버넌스 참여",
    description: "주요 거버넌스 투표에 참여하고 피드백을 제공하세요",
    reward: 75,
    rewardType: "USDC",
    platforms: ["discord", "telegram"],
    participants: 432,
    deadline: "2024-04-01T00:00:00Z",
    difficulty: "Medium"
  },
  {
    id: 9,
    title: "DeFi 전략 콘테스트",
    description: "우리 프로토콜을 활용한 혁신적인 DeFi 전략을 설계하고 공유하세요",
    reward: 200,
    rewardType: "USDT",
    platforms: ["discord"],
    participants: 156,
    deadline: "2024-04-02T00:00:00Z",
    difficulty: "Hard"
  },
  {
    id: 10,
    title: "커뮤니티 번역",
    description: "문서를 다양한 언어로 번역하는 작업에 참여하세요",
    reward: 60,
    rewardType: "USDC",
    platforms: ["discord", "telegram"],
    participants: 678,
    deadline: "2024-04-03T00:00:00Z",
    difficulty: "Medium"
  },
  {
    id: 11,
    title: "NFT 디자인 챌린지",
    description: "다가오는 컬렉션을 위한 독특한 NFT 디자인을 제작하세요",
    reward: 150,
    rewardType: "USDT",
    platforms: ["discord"],
    participants: 345,
    deadline: "2024-04-04T00:00:00Z",
    difficulty: "Hard"
  },
  {
    id: 12,
    title: "소셜미디어 챌린지",
    description: "우리 생태계에 대한 바이럴 소셜미디어 콘텐츠를 제작하세요",
    reward: 45,
    rewardType: "USDC",
    platforms: ["twitter", "telegram"],
    participants: 890,
    deadline: "2024-04-05T00:00:00Z",
    difficulty: "Medium"
  }
];

const QuestCard = ({ quest }) => {
  const navigate = useNavigate();

  const getPlatformIcon = (platform) => {
    switch (platform) {
      case 'twitter':
        return <Twitter className="h-4 w-4 text-blue-400" />;
      case 'discord':
        return <MessageCircle className="h-4 w-4 text-indigo-400" />;
      case 'telegram':
        return <Send className="h-4 w-4 text-sky-400" />;
      default:
        return null;
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty.toLowerCase()) {
      case 'easy':
        return 'bg-green-100 text-green-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'hard':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getDifficultyText = (difficulty) => {
    switch (difficulty.toLowerCase()) {
      case 'easy':
        return '쉬움';
      case 'medium':
        return '보통';
      case 'hard':
        return '어려움';
      default:
        return difficulty;
    }
  };

  return (
    <div
      className="relative group cursor-pointer"
      onClick={() => navigate(`/quest/${quest.id}`)}
    >
      <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden">
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">{quest.title}</h3>
              <p className="text-sm text-gray-600 line-clamp-2">{quest.description}</p>
            </div>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(quest.difficulty)}`}>
              {getDifficultyText(quest.difficulty)}
            </span>
          </div>

          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              {quest.platforms.map((platform, index) => (
                <div key={index} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                  {getPlatformIcon(platform)}
                </div>
              ))}
            </div>
            <div className="flex items-center space-x-1">
              <DollarSign className="h-4 w-4 text-green-500" />
              <span className="font-semibold text-green-500">{quest.reward} {quest.rewardType}</span>
            </div>
          </div>

          <div className="flex items-center justify-between text-sm text-gray-500">
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
    </div>
  );
};

const OngoingQuests = () => {
  return (
    <div className="mt-16">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">에어드롭 퀘스트</h2>
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <Timer className="w-4 h-4" />
          <span>매일 업데이트</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockQuestData.map((quest) => (
          <QuestCard key={quest.id} quest={quest} />
        ))}
      </div>
    </div>
  );
};

export default OngoingQuests;