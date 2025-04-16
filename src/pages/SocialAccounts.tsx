import React from 'react';
import { usePrivy } from '@privy-io/react-auth';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SocialAccounts = () => {
  const { ready, authenticated, user } = usePrivy();
  const navigate = useNavigate();

  if (!ready || !authenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button
        onClick={() => navigate('/profile')}
        className="mb-6 flex items-center text-gray-600 hover:text-blue-600 transition-colors duration-200"
      >
        <ArrowLeft className="h-5 w-5 mr-2" />
        프로필로 돌아가기
      </button>

      <div className="bg-white rounded-xl shadow-lg p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">SNS 계정 연동</h1>
        
        <div className="space-y-6">
          {/* Google */}
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center space-x-3">
              <img
                src="https://www.google.com/favicon.ico"
                alt="Google"
                className="w-6 h-6"
              />
              <div>
                <h3 className="font-medium text-gray-900">Google</h3>
                <p className="text-sm text-gray-500">
                  {user?.google?.email || '연동되지 않음'}
                </p>
              </div>
            </div>
            <button
              onClick={() => user?.linkGoogle()}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${
                user?.google
                  ? 'bg-gray-100 text-gray-600'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
              disabled={!!user?.google}
            >
              {user?.google ? '연동됨' : '연동하기'}
            </button>
          </div>

          {/* Twitter */}
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center space-x-3">
              <img
                src="https://abs.twimg.com/favicons/twitter.ico"
                alt="Twitter"
                className="w-6 h-6"
              />
              <div>
                <h3 className="font-medium text-gray-900">Twitter</h3>
                <p className="text-sm text-gray-500">
                  {user?.twitter?.username ? `@${user.twitter.username}` : '연동되지 않음'}
                </p>
              </div>
            </div>
            <button
              onClick={() => user?.linkTwitter()}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${
                user?.twitter
                  ? 'bg-gray-100 text-gray-600'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
              disabled={!!user?.twitter}
            >
              {user?.twitter ? '연동됨' : '연동하기'}
            </button>
          </div>

          {/* Discord */}
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center space-x-3">
              <img
                src="https://discord.com/assets/847541504914fd33810e70a0ea73177e.ico"
                alt="Discord"
                className="w-6 h-6"
              />
              <div>
                <h3 className="font-medium text-gray-900">Discord</h3>
                <p className="text-sm text-gray-500">
                  {user?.discord?.username || '연동되지 않음'}
                </p>
              </div>
            </div>
            <button
              onClick={() => user?.linkDiscord()}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${
                user?.discord
                  ? 'bg-gray-100 text-gray-600'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
              disabled={!!user?.discord}
            >
              {user?.discord ? '연동됨' : '연동하기'}
            </button>
          </div>
        </div>

        <div className="mt-8 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-sm font-medium text-gray-900 mb-2">
            SNS 계정 연동 시 혜택
          </h3>
          <ul className="text-sm text-gray-600 space-y-2">
            <li>• 퀘스트 자동 완료 확인</li>
            <li>• 추가 보상 지급</li>
            <li>• KOL 활동 시 인증 마크 부여</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SocialAccounts;