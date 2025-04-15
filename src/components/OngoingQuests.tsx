import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Timer, Users, Twitter, MessageCircle, Send, DollarSign } from 'lucide-react';

const mockQuestData = [
  {
    id: 1,
    title: "Follow and Retweet Campaign",
    description: "Follow our Twitter account and retweet the pinned post about our latest protocol upgrade",
    reward: 25,
    rewardType: "USDT",
    platforms: ["twitter"],
    participants: 1234,
    deadline: "2024-03-25T00:00:00Z",
    difficulty: "Easy"
  },
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
  },
  {
    id: 6,
    title: "Bug Bounty Program",
    description: "Find and report security vulnerabilities in our smart contracts",
    reward: 500,
    rewardType: "USDC",
    platforms: ["discord"],
    participants: 89,
    deadline: "2024-03-30T00:00:00Z",
    difficulty: "Hard"
  },
  {
    id: 7,
    title: "Meme Contest",
    description: "Create original memes about our project and share them",
    reward: 30,
    rewardType: "USDT",
    platforms: ["twitter", "discord"],
    participants: 2345,
    deadline: "2024-03-31T00:00:00Z",
    difficulty: "Easy"
  },
  {
    id: 8,
    title: "Governance Participation",
    description: "Participate in key governance votes and provide feedback",
    reward: 75,
    rewardType: "USDC",
    platforms: ["discord", "telegram"],
    participants: 432,
    deadline: "2024-04-01T00:00:00Z",
    difficulty: "Medium"
  },
  {
    id: 9,
    title: "DeFi Strategy Contest",
    description: "Design and share innovative DeFi strategies using our protocol",
    reward: 200,
    rewardType: "USDT",
    platforms: ["discord"],
    participants: 156,
    deadline: "2024-04-02T00:00:00Z",
    difficulty: "Hard"
  },
  {
    id: 10,
    title: "Community Translation",
    description: "Help translate our documentation into different languages",
    reward: 60,
    rewardType: "USDC",
    platforms: ["discord", "telegram"],
    participants: 678,
    deadline: "2024-04-03T00:00:00Z",
    difficulty: "Medium"
  },
  {
    id: 11,
    title: "NFT Design Challenge",
    description: "Create unique NFT designs for our upcoming collection",
    reward: 150,
    rewardType: "USDT",
    platforms: ["discord"],
    participants: 345,
    deadline: "2024-04-04T00:00:00Z",
    difficulty: "Hard"
  },
  {
    id: 12,
    title: "Social Media Challenge",
    description: "Create viral social media content about our ecosystem",
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
              {quest.difficulty}
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
              <span>{quest.participants.toLocaleString()} participants</span>
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
        <h2 className="text-2xl font-bold text-gray-900">Ongoing Quests</h2>
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <Timer className="w-4 h-4" />
          <span>Updated daily</span>
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