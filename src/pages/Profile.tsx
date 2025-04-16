import React from 'react';
import { usePrivy } from '@privy-io/react-auth';
import { User, Mail, Wallet, ExternalLink, Star, Clock, Bell, Copy, Users, Link as LinkIcon } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

function Profile() {
  const { user: privyUser, ready: privyReady } = usePrivy();
  const { user: firebaseUser, loading: firebaseLoading } = useAuth();
  const navigate = useNavigate();

  // Firebase 로딩이 완료되고 사용자가 없으면 로그인 페이지로 리다이렉트
  React.useEffect(() => {
    if (!firebaseLoading && !firebaseUser) {
      navigate('/login');
    }
  }, [firebaseLoading, firebaseUser, navigate]);

  // Firebase 로딩 중이거나 사용자가 없으면 로딩 표시
  if (firebaseLoading || !firebaseUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const pointsHistory = [
    { id: 1, type: "전구 조대 포인트", amount: 35, date: "2024-05-17 23:11:05" },
    { id: 2, type: "전구 조대 포인트", amount: 35, date: "2024-05-17 23:11:05" },
    { id: 3, type: "1day 출석체크 포인트", amount: 60, date: "2024-05-17 23:11:05" },
    { id: 4, type: "2day 출석체크 포인트", amount: 20, date: "2024-05-17 23:11:05" },
    { id: 5, type: "3day 출석체크 포인트", amount: 20, date: "2024-05-17 23:11:05" },
  ];

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // You could add a toast notification here
  };

  const referralLink = "https://www.fl3x.ai/referral/ab97dh1i29yuddj";

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Info */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex flex-col items-center text-center">
              {firebaseUser.photoURL ? (
                <img
                  src={firebaseUser.photoURL}
                  alt={firebaseUser.email || ''}
                  className="w-24 h-24 rounded-full"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                  <User className="h-12 w-12 text-white" />
                </div>
              )}
              <h2 className="mt-4 text-xl font-bold text-gray-900">
                {firebaseUser.email?.split('@')[0] || '사용자'}
              </h2>
              
              <div className="mt-4 w-full">
                <Link
                  to="/social-accounts"
                  className="flex items-center justify-between py-3 border-b hover:bg-gray-50 px-3 -mx-3 rounded-lg"
                >
                  <div className="flex items-center text-gray-600">
                    <LinkIcon className="h-5 w-5 mr-2" />
                    <span>SNS 계정 연동</span>
                  </div>
                  <ExternalLink className="h-4 w-4 text-gray-400" />
                </Link>
                <div className="flex items-center justify-between py-3 border-b">
                  <div className="flex items-center text-gray-600">
                    <Mail className="h-5 w-5 mr-2" />
                    <span>이메일</span>
                  </div>
                  <span className="text-gray-900">{firebaseUser.email}</span>
                </div>
                {privyReady && privyUser?.wallet && (
                  <div className="flex items-center justify-between py-3 border-b">
                    <div className="flex items-center text-gray-600">
                      <Wallet className="h-5 w-5 mr-2" />
                      <span>지갑 주소</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-gray-900">
                        {privyUser.wallet.address?.slice(0, 6)}...{privyUser.wallet.address?.slice(-4)}
                      </span>
                      <a
                        href={`https://etherscan.io/address/${privyUser.wallet.address}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ml-2 text-blue-600 hover:text-blue-800"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Referral Section */}
          <div className="mt-6 bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold mb-4">레퍼럴 프로그램</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">초대한 친구</span>
                <span className="font-semibold">123명</span>
              </div>
              <div>
                <label className="text-sm text-gray-600 mb-2 block">나의 레퍼럴 링크</label>
                <div className="flex items-center">
                  <input
                    type="text"
                    value={referralLink}
                    readOnly
                    className="flex-1 bg-gray-50 rounded-l-lg px-3 py-2 text-sm border focus:outline-none"
                  />
                  <button
                    onClick={() => copyToClipboard(referralLink)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-r-lg hover:bg-blue-700"
                  >
                    <Copy className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Points History */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold">포인트 적립 내역</h3>
              <div className="flex items-center space-x-2">
                <span className="text-gray-600">총 보유 포인트:</span>
                <span className="font-bold text-blue-600">12,350 P</span>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 text-gray-600">구분</th>
                    <th className="text-right py-3 px-4 text-gray-600">포인트 누적 내용</th>
                    <th className="text-right py-3 px-4 text-gray-600">지급된 포인트</th>
                    <th className="text-right py-3 px-4 text-gray-600">포인트 지급 시각</th>
                  </tr>
                </thead>
                <tbody>
                  {pointsHistory.map((history, index) => (
                    <tr key={history.id} className="border-b last:border-0">
                      <td className="py-3 px-4">{index + 1}</td>
                      <td className="py-3 px-4 text-right">{history.type}</td>
                      <td className="py-3 px-4 text-right font-medium">{history.amount} P</td>
                      <td className="py-3 px-4 text-right text-gray-600">{history.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;