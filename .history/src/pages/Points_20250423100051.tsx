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
      link: '/quests',
    },
    {
      id: 2,
      title: '투표 참여',
      description: '코인 투표에 참여하고 포인트를 받으세요',
      points: 200,
      icon: Star,
      link: '/voting',
    },
    {
      id: 3,
      title: '친구 초대',
      description: '친구를 초대하고 추가 포인트를 받으세요',
      points: 1000,
      icon: Gift,
      link: '/profile',
    },
  ];

  return (
    <div className="points-section">
      {/* 상단 요약 */}
      <div className="points-header">
        <h1>포인트 모으기</h1>
        <p>다양한 활동을 통해 포인트를 모아보세요</p>
      </div>

      <div className="points-summary">
        <div>
          <p className="opacity-80">현재 보유 포인트</p>
          <h2>12,350 P</h2>
        </div>
        <Link
          to="/profile"
          className="flex items-center space-x-2 bg-white/20 px-4 py-2 rounded-lg hover:bg-white/30 transition-colors duration-200"
        >
          <span>포인트 내역</span>
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      {/* 메인 그리드 */}
      <div className="points-grid">
        {/* 출석 체크 왼쪽 */}
        <div className="checkin-block">
          <h2>출석체크 포인트</h2>
          <p>매일 출석체크하고 포인트를 받으세요. 7일 연속 시 보너스!</p>

          <div className="checkin-grid">
            {dailyRewards.map(({ day, points }) => (
              <button
                key={day}
                onClick={() => handleCheckIn(day)}
                disabled={checkedDays.includes(day)}
                className={`checkin-button ${checkedDays.includes(day) ? 'checked' : ''} ${day === 7 ? 'bonus' : ''}`}
              >
                <div className="text-lg font-semibold mb-1">Day{day}</div>
                <div className="flex items-center justify-center">
                  <Star className="h-4 w-4 mr-1 text-yellow-400" />
                  <span className="font-bold">+{points}</span>
                </div>
                {checkedDays.includes(day) && (
                  <div className="checkin-checkmark">
                    <Check className="h-5 w-5" />
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* 퀘스트 우측 */}
        <div className="quest-grid">
          {pointActivities.map((activity) => (
            <Link key={activity.id} to={activity.link} className="quest-box hover:cursor-pointer">
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center space-x-2">
                  <activity.icon className="h-5 w-5 text-blue-600" />
                  <h3 className="font-semibold text-gray-900">{activity.title}</h3>
                </div>
              </div>
              <p className="text-sm text-gray-400 mb-3">{activity.description}</p>
              <div className="flex items-center space-x-1">
                <Star className="h-4 w-4 text-yellow-400" />
                <span className="font-bold text-gray-900">{activity.points} P</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Points;
