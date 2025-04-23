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
      id: 2,
      title: '퀘스트 완료',
      description: '다양한 퀘스트를 완료하고 포인트를 획득하세요',
      points: 500,
      icon: Trophy,
      link: '/quests'
    },
    {
      id: 3,
      title: '투표 참여',
      description: '코인 투표에 참여하고 포인트를 받으세요',
      points: 200,
      icon: Star,
      link: '/'
    },
    {
      id: 4,
      title: '친구 초대',
      description: '친구를 초대하고 추가 포인트를 받으세요',
      points: 1000,
      icon: Gift,
      link: '/profile'
    }
  ];

  return (
    <div className="points-container font-['Montserrat','Pretendard']">
      {/* Header */}
      <div className="points-header">
        <h1 className="points-title">포인트 현황</h1>
        <p className="points-subtitle">현재 내가 모은 포인트예요</p>
      </div>

      {/* Summary */}
      <div className="points-summary">
        <div>
          <p className="points-label">현재 보유 포인트</p>
          <h2 className="points-value">12,350 P</h2>
        </div>
        <Link to="/profile" className="points-history-btn">
          포인트 내역 <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      {/* Body Section */}
      <div className="points-body">
        {/* Check-in Section */}
        <div className="points-checkin">
          <h2 className="section-title">출석체크 포인트</h2>
          <p className="section-subtitle">
            매일 출석체크하고 포인트를 받으세요. 7일 연속 시 보너스!
          </p>

          <div className="checkin-grid">
            {dailyRewards.map(({ day, points }) => (
              <div
                key={day}
                className={`checkin-box ${checkedDays.includes(day) ? 'checked' : ''} ${
                  day === 7 ? 'day7-box' : ''
                }`}
                onClick={() => handleCheckIn(day)}
              >
                {checkedDays.includes(day) && (
                  <Check className="checkin-check" />
                )}
                <img
                  src="https://raw.githubusercontent.com/blockdreamers/Kuest3/dev/m2H7i8d3b1K9G6N4%20(1)%201.png"
                  alt="chest"
                  className={`checkin-img ${day === 7 ? 'big' : ''}`}
                />
                <div className="checkin-day">Day{day}</div>
                <div className="checkin-points">
                  <Star className="h-3 w-3" /> +{points}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quests Section */}
        <div className="points-quests">
          <h2 className="section-title">퀘스트 포인트</h2>
          <p className="section-subtitle">퀘스트를 수행하고 포인트를 모을 수 있어요</p>
          <div className="quest-list">
            {pointActivities.map((activity) => (
              <Link
                key={activity.id}
                to={activity.link}
                className="quest-card"
              >
                <activity.icon className="h-6 w-6 text-blue-500 quest-card-icon" />
                <div className="flex flex-col">
                  <span className="quest-title">{activity.title}</span>
                  <span className="quest-desc">{activity.description}</span>
                  <span className="quest-points">
                    <Star className="h-3 w-3" />
                    {activity.points} P
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Points;
