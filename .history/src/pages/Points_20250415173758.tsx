import React, { useState } from 'react';
import { Star, Gift, Trophy, Clock, ArrowRight, Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const Points = () => {
  const [checkedDays, setCheckedDays] = useState<number[]>([]);

  const dailyRewards = [
    { day: 1, points: 10 },
    { day: 2, points: 12 },
    { day: 3, points: 14 },
    { day: 4, points: 16 },
    { day: 5, points: 18 },
    { day: 6, points: 20 },
    { day: 7, points: 72 }
  ];

  const handleCheckIn = (day: number) => {
    if (checkedDays.includes(day)) {
      toast.error('이미 출석체크를 완료했습니다');
      return;
    }

    if (day > 1 && !checkedDays.includes(day - 1)) {
      toast.error('이전 날짜의 출석체크를 먼저 완료해주세요');
      return;
    }

    setCheckedDays(prev => [...prev, day]);
    toast.success(`${day}일차 출석체크 완료! +${dailyRewards[day - 1].points} 포인트`);
  };

  const pointActivities = [
    {
      id: 2,
      title: '퀘스트 완료',
      description: '다양한 퀘스트를 완료하고 포인트를 획득하세요',
      points: 500,
      icon: Trophy,
      link: '/quests',
      type: 'quest'
    },
    {
      id: 3,
      title: '투표 참여',
      description: '코인 투표에 참여하고 포인트를 받으세요',
      points: 200,
      icon: Star,
      link: '/',
      type: 'vote'
    },
    {
      id: 4,
      title: '친구 초대',
      description: '친구를 초대하고 추가 포인트를 받으세요',
      points: 1000,
      icon: Gift,
      link: '/profile',
      type: 'referral'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">포인트 모으기</h1>
        <p className="mt-2 text-gray-600">다양한 활동을 통해 포인트를 모아보세요</p>
      </div>

      {/* Points Summary */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 mb-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-lg opacity-90">현재 보유 포인트</p>
            <h2 className="text-4xl font-bold mt-2">12,350 P</h2>
          </div>
          <Link
            to="/profile"
            className="flex items-center space-x-2 bg-white/20 px-4 py-2 rounded-lg hover:bg-white/30 transition-colors duration-200"
          >
            <span>포인트 내역</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

      {/* Daily Check-in Section */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">출석 체크</h2>
        <p className="text-gray-600 mb-6">매일 출석체크하고 포인트를 받으세요. 7일 연속 출석시 보너스 포인트!</p>
        
        <div className="grid grid-cols-3 md:grid-cols-7 gap-4">
          {dailyRewards.map(({ day, points }) => (
            <button
              key={day}
              onClick={() => handleCheckIn(day)}
              disabled={checkedDays.includes(day)}
              className={`relative group ${
                day === 7 ? 'col-span-3 md:col-span-1' : ''
              }`}
            >
              <div
                className={`
                  aspect-square rounded-lg p-4 flex flex-col items-center justify-center
                  transition-all duration-200 transform
                  ${
                    checkedDays.includes(day)
                      ? 'bg-purple-600 text-white'
                      : 'bg-purple-100 hover:bg-purple-200 hover:scale-105'
                  }
                `}
              >
                <div className="text-lg font-semibold mb-1">Day {day}</div>
                <div className="flex items-center">
                  <Star className="h-4 w-4 mr-1" />
                  <span>+{points}</span>
                </div>
                {checkedDays.includes(day) && (
                  <div className="absolute inset-0 flex items-center justify-center bg-purple-600 bg-opacity-90 rounded-lg">
                    <Check className="h-8 w-8 text-white" />
                  </div>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Other Activities Grid */}
      <h2 className="text-xl font-semibold mb-4">추가 포인트 획득</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {pointActivities.map((activity) => (
          <Link
            key={activity.id}
            to={activity.link}
            className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02]"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3">
                  <activity.icon className="h-6 w-6 text-blue-600" />
                  <h3 className="text-lg font-semibold text-gray-900">{activity.title}</h3>
                </div>
                <p className="mt-2 text-gray-600">{activity.description}</p>
                <div className="mt-4 flex items-center space-x-2">
                  <Star className="h-5 w-5 text-yellow-400" />
                  <span className="font-semibold text-gray-900">{activity.points} P</span>
                </div>
              </div>
              <ArrowRight className="h-5 w-5 text-gray-400" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Points;