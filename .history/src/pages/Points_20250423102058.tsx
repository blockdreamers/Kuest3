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
    toast.success(`${day}일차 출석 완료! +${dailyRewards[day - 1].points}P`);
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
      link: '/',
    },
    {
      id: 3,
      title: '친구 초대',
      description: '친구를 초대하고 추가 포인트를 받으세요',
      points: 1000,
      icon: Gift,
      link: '/profile',
    }
  ];

  return (
    <div className="points-section">
      <h1 className="text-2xl font-bold text-black mb-1">포인트 모으기</h1>
      <p className="text-gray-600 mb-6">다양한 활동을 통해 포인트를 모아보세요</p>

      <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl p-6 mb-8 flex justify-between items-center">
        <div>
          <p className="opacity-80 text-sm">현재 보유 포인트</p>
          <h2 className="text-4xl font-bold mt-1">12,350 P</h2>
        </div>
        <Link
          to="/profile"
          className="bg-white text-sm px-4 py-2 rounded-lg text-black font-semibold hover:bg-gray-100 transition"
        >
          포인트 내역 →
        </Link>
      </div>

      <div className="points-grid">
        {/* 왼쪽: 출석 체크 */}
        <div className="checkin-block">
          <h2 className="text-lg font-bold mb-1">출석체크 포인트</h2>
          <p className="text-sm text-gray-600 mb-4">
            매일 출석체크하고 포인트를 받으세요. 7일 연속 시 보너스!
          </p>
          <div className="checkin-grid">
            {dailyRewards.map(({ day, points }) => (
              <button
                key={day}
                onClick={() => handleCheckIn(day)}
                disabled={checkedDays.includes(day)}
                className={`checkin-button ${checkedDays.includes(day) ? 'checked' : ''} ${day === 7 ? 'bonus' : ''}`}
              >
                <img
                  src="https://raw.githubusercontent.com/blockdreamers/Kuest3/dev/m2H7i8d3b1K9G6N4%20(1)%201.png"
                  alt="chest"
                />
                <div className="text-sm font-semibold mt-1">Day{day}</div>
                <div className="text-yellow-400 text-sm mt-0.5">⭐ +{points}</div>
                {checkedDays.includes(day) && (
                  <div className="absolute inset-0 bg-black/60 text-white flex items-center justify-center rounded-lg">
                    <Check className="h-6 w-6" />
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* 오른쪽: 퀘스트 포인트 */}
        <div className="quest-block">
          <div className="quest-header">
            <h2 className="text-lg font-bold mb-1">퀘스트 포인트</h2>
            <p className="text-sm text-gray-600">
              퀘스트를 수행하고 포인트를 모을 수 있어요
            </p>
          </div>

          {pointActivities.map(({ id, title, description, points, icon: Icon, link }) => (
            <Link to={link} key={id} className="quest-box">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center space-x-2 mb-1">
                    <Icon className="h-5 w-5 text-blue-400" />
                    <h3 className="font-semibold text-sm">{title}</h3>
                  </div>
                  <p className="text-sm text-gray-300">{description}</p>
                </div>
                <div className="text-yellow-400 font-semibold text-sm mt-1 whitespace-nowrap">
                  ⭐ {points} P
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Points;
