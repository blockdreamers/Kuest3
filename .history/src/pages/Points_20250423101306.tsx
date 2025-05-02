import React, { useState } from 'react';
import { Star, Gift, Trophy, ArrowRight, Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import './Points.css';

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
      id: 1,
      title: '퀘스트 완료',
      description: '다양한 퀘스트를 완료하고 포인트를 획득하세요',
      points: 500,
      icon: Trophy,
      link: '/quests'
    },
    {
      id: 2,
      title: '투표 참여',
      description: '코인 투표에 참여하고 포인트를 받으세요',
      points: 200,
      icon: Star,
      link: '/vote'
    },
    {
      id: 3,
      title: '친구 초대',
      description: '친구를 초대하고 추가 포인트를 받으세요',
      points: 1000,
      icon: Gift,
      link: '/referral'
    }
  ];

  return (
    <div className="points-section">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-black">포인트 모으기</h1>
        <p className="mt-2 text-gray-600">다양한 활동을 통해 포인트를 모아보세요</p>
      </div>

      {/* 포인트 보유 현황 */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 mb-10 text-white flex justify-between items-center">
        <div>
          <p className="text-lg opacity-90">현재 보유 포인트</p>
          <h2 className="text-4xl font-bold mt-2">12,350 P</h2>
        </div>
        <Link to="/profile" className="bg-white text-sm text-black font-medium px-4 py-2 rounded hover:bg-gray-100 transition">
          포인트 내역 →
        </Link>
      </div>

      {/* 본문 레이아웃 */}
      <div className="points-grid">
        {/* 출석체크 */}
        <div className="checkin-block">
          <h2 className="text-lg font-bold text-black mb-1">출석체크 포인트</h2>
          <p className="text-sm text-gray-600 mb-4">매일 출석체크하고 포인트를 받으세요. 7일 연속 시 보너스!</p>

          <div className="checkin-grid">
            {dailyRewards.map(({ day, points }) => (
              <button
                key={day}
                onClick={() => handleCheckIn(day)}
                disabled={checkedDays.includes(day)}
                className={`checkin-button ${checkedDays.includes(day) ? 'checked' : ''} ${day === 7 ? 'bonus' : ''}`}
              >
                <img
                  src="https://github.com/blockdreamers/Kuest3/blob/dev/m2H7i8d3b1K9G6N4%20(1)%201.png?raw=true"
                  alt={`day${day}`}
                />
                <div className="text-sm font-semibold">{`Day${day}`}</div>
                <div className="flex items-center space-x-1 text-yellow-400 text-sm">
                  <Star className="w-4 h-4" />
                  <span>+{points}</span>
                </div>
                {checkedDays.includes(day) && (
                  <div className="absolute inset-0 flex items-center justify-center bg-purple-600 bg-opacity-90 rounded-lg">
                    <Check className="h-6 w-6 text-white" />
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* 퀘스트 포인트 */}
        <div className="quest-block">
          <div className="quest-header">
            <h2 className="text-xl font-bold text-white mb-1">퀘스트 포인트</h2>
            <p className="text-sm text-gray-400">퀘스트를 수행하고 포인트를 모을 수 있어요</p>
          </div>
          {pointActivities.map((activity) => (
            <Link to={activity.link} key={activity.id} className="quest-box hover:scale-[1.01]">
              <div className="flex items-center space-x-3 mb-1">
                <activity.icon className="w-4 h-4 text-blue-500" />
                <h3 className="quest-title">{activity.title}</h3>
              </div>
              <p className="quest-description mb-2">{activity.description}</p>
              <div className="flex items-center space-x-1 text-yellow-400 font-semibold">
                <Star className="w-4 h-4" />
                <span>{activity.points} P</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Points;
