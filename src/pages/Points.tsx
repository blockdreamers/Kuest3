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

    setCheckedDays((prev) => [...prev, day]);
    toast.success(`${day}일차 출석체크 완료! +${dailyRewards[day - 1].points} 포인트`);
  };

  const pointActivities = [
    {
      id: 1,
      title: '퀘스트 완료',
      description: '다양한 퀘스트를 완료하고 포인트를 획득하세요',
      points: 500,
      icon: Trophy
    },
    {
      id: 2,
      title: '투표 참여',
      description: '코인 투표에 참여하고 포인트를 받으세요',
      points: 200,
      icon: Star
    },
    {
      id: 3,
      title: '친구 초대',
      description: '친구를 초대하고 추가 포인트를 받으세요',
      points: 1000,
      icon: Gift
    }
  ];

  return (
    <div className="points-container">
      <div className="points-header">
        <h1 className="points-title">포인트 모으기</h1>
        <p className="points-subtitle">다양한 활동을 통해 포인트를 모아보세요</p>
      </div>

      <div className="points-summary">
        <div>
          <p className="points-label">현재 보유 포인트</p>
          <h2 className="points-value">12,350 P</h2>
        </div>
        <Link to="/profile" className="points-history-btn">
          포인트 내역 <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="points-body">
        {/* 출석체크 왼쪽 */}
        <div className="points-checkin">
          <h2 className="section-title">출석체크 포인트</h2>
          <p className="section-subtitle">매일 출석체크하고 포인트를 받으세요. 7일 연속 시 보너스!</p>
          <div className="checkin-grid">
            {dailyRewards.map(({ day, points }) => (
              <div
                key={day}
                className={`checkin-box ${checkedDays.includes(day) ? 'checked' : ''} ${day === 7 ? 'day7-box' : ''}`}
                onClick={() => handleCheckIn(day)}
              >
                <img
                  src="https://github.com/blockdreamers/Kuest3/blob/dev/m2H7i8d3b1K9G6N4%20(1)%201.png?raw=true"
                  alt="treasure"
                  className={`checkin-img ${day === 7 ? 'big' : ''}`}
                />
                <div className="checkin-day">{`Day${day}`}</div>
                {checkedDays.includes(day) && <Check className="checkin-check" />}
                <div className="checkin-points">
                  <Star className="h-3 w-3 text-yellow-400" />
                  <span>+{points}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 퀘스트 포인트 우측 */}
        <div className="points-quests">
          <h2 className="section-title">퀘스트 포인트</h2>
          <p className="section-subtitle">퀘스트를 수행하고 포인트를 모을 수 있어요</p>
          <div className="quest-list">
            {pointActivities.map((activity) => (
              <div key={activity.id} className="quest-card">
                <div className="quest-card-icon">
                  <activity.icon className="h-5 w-5 text-blue-400" />
                </div>
                <div className="quest-card-content">
                  <h3 className="quest-title">{activity.title}</h3>
                  <p className="quest-desc">{activity.description}</p>
                  <div className="quest-points">
                    <Star className="h-4 w-4 text-yellow-400" />
                    <span>{activity.points} P</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Points;
