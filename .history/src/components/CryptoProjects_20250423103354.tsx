import React, { useState } from 'react';
import { Star, Gift, Trophy, ArrowRight, Check, Send, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const Points = () => {
  const [checkedDays, setCheckedDays] = useState<number[]>([1, 2, 3, 4, 5, 6]); // 예시용 체크

  const dailyRewards = [
    { day: 1, points: 10 },
    { day: 2, points: 12 },
    { day: 3, points: 14 },
    { day: 4, points: 16 },
    { day: 5, points: 18 },
    { day: 6, points: 20 },
    { day: 7, points: 72 },
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
    setCheckedDays((prev) => [...prev, day]);
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
      link: '/votes',
    },
    {
      id: 3,
      title: '친구 초대',
      description: '친구를 초대하고 추가 포인트를 받으세요',
      points: 1000,
      icon: Gift,
      link: '/referral',
    },
  ];

  return (
    <div className="points-wrapper font-['Montserrat','Pretendard']">
      {/* 포인트 요약 */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white mb-12 flex justify-between items-center">
        <div>
          <p className="text-lg opacity-90">현재 보유 포인트</p>
          <h2 className="text-4xl font-bold mt-2">12,350 P</h2>
        </div>
        <Link
          to="/profile"
          className="bg-white text-sm text-black px-4 py-2 rounded-lg hover:bg-gray-200 transition"
        >
          포인트 내역 →
        </Link>
      </div>

      {/* 출석체크 + 퀘스트 */}
      <div className="points-body">
        {/* 출석체크 */}
        <div className="points-checkin">
          <h2 className="text-xl font-bold mb-1">출석체크 포인트</h2>
          <p className="text-sm text-gray-600 mb-4">
            매일 출석체크하고 포인트를 받으세요. <span className="text-xs text-blue-600">7일 연속 시 보너스!</span>
          </p>
          <div className="checkin-grid">
            {dailyRewards.map(({ day, points }) => (
              <button
                key={day}
                onClick={() => handleCheckIn(day)}
                className={`checkin-box ${checkedDays.includes(day) ? 'checked' : ''}`}
              >
                <img
                  src="https://github.com/blockdreamers/Kuest3/blob/dev/m2H7i8d3b1K9G6N4%20(1)%201.png?raw=true"
                  alt="treasure"
                  className="w-12 h-12 object-contain mb-2"
                />
                <div className="text-sm font-semibold">{`Day${day}`}</div>
                <div className="text-sm font-medium flex items-center justify-center gap-1 text-yellow-400">
                  <Star className="w-3 h-3" />
                  +{points}
                </div>
                {checkedDays.includes(day) && (
                  <Check className="absolute top-1 right-1 w-4 h-4 text-black bg-white rounded-full p-[1px]" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* 퀘스트 */}
        <div className="points-quests">
          <h2 className="text-xl font-bold mb-1">퀘스트 포인트</h2>
          <p className="text-sm text-gray-600 mb-4">퀘스트를 수행하고 포인트를 모을 수 있어요</p>
          <div className="quest-list flex flex-col gap-3">
            {pointActivities.map((activity) => (
              <Link
                key={activity.id}
                to={activity.link}
                className="quest-card hover-effect flex items-start gap-4"
              >
                <activity.icon className="w-6 h-6 mt-1 text-blue-400" />
                <div className="flex-1">
                  <div className="font-semibold text-base">{activity.title}</div>
                  <p className="text-sm text-gray-400 mb-1">{activity.description}</p>
                  <div className="text-sm font-medium flex items-center gap-1 text-yellow-400">
                    <Star className="w-3 h-3" />
                    {activity.points} P
                  </div>
                </div>
              </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Points;
