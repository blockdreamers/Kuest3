import React from 'react';
import { MessageCircle, Share2, Heart, Repeat2, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

const mockTelegramPosts = [
  {
    id: 1,
    channelName: '취미생활방 💫',
    username: '@enjoymyhobby',
    content: '📌 취미생활방 리서치 Written by "SB"\n\n📊 미국 기대 인플레이션\n\n미국 기대 인플레이션이 단기적으로 고개를 숙일소리 들이올리고 있다.\n\n단기적인 1년 내 물가 상승률 예상치는 0.5%p 상승해 3.6%.\n\n중기적인 3년 내 물가 상승률 예상치는 3.0%',
    timestamp: '2024-04-15 18:12',
    views: 1,
    replies: 0,
    forwards: 1,
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e'
  },
  {
    id: 2,
    channelName: '메실타과 트럽프는 반드시 승리할것',
    username: '@walstudy',
    content: '지금까지 멋쟁 주신분들은 다 필료잉 해드렸네요',
    timestamp: '2024-04-15 18:08',
    views: 117,
    replies: 5,
    forwards: 0,
    avatar: 'https://images.unsplash.com/photo-1550525811-e5869dd03032'
  },
  {
    id: 3,
    channelName: 'HAVELAW WEB THREE',
    username: '@havelaw',
    content: 'Hemi, 포인트 확인하기\n\n지금까지 스테이킹으로 획득한 포인트를 확인할 수 있는 리더보드가 공개되어 알려드립니다.\n\n현재 포인트는 스테이킹한 반영된 잔수로 LP 기반한 포인트는 추후 업데이트 된다고 하네요.\n\n그리고 해당 사이트 아래에 DEMOS 인증해서 500pts 획득할 수 있으니 이전에 참여하셨던 분들이라면 참고해보시기 바랍니다.',
    timestamp: '2024-04-15 18:04',
    views: 66,
    replies: 3,
    forwards: 1,
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e'
  },
  {
    id: 4,
    channelName: 'GMB LABS',
    username: '@GMBLABS',
    content: '⚡️⚡️⚡️⚡️⚡️\n\n• 스트레터지, $2.85의 BTC 매수\n• 폭 SEC, 그레이스케일 ETH 현물 ETF 스테이킹 승인 결정 연기\n• $OM CEO, 바이백-소각 계획 수립 초기 단계\n• 바이낸스 CEO, ZEC 관련 조작 없었다\n• 코인베이스, $KERNEL 상장',
    timestamp: '2024-04-15 18:02',
    views: 218,
    replies: 3,
    forwards: 1,
    avatar: 'https://images.unsplash.com/photo-1550525811-e5869dd03032'
  }
];

const TelegramFeed = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">최신 텔레그램 포스팅</h1>
        <p className="mt-2 text-gray-600">최근 텔레그램 포스팅을 확인하세요!</p>
      </div>

      <div className="space-y-4">
        {mockTelegramPosts.map((post) => (
          <div key={post.id} className="bg-white rounded-xl shadow-md p-6">
            {/* Channel Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <img
                  src={post.avatar}
                  alt={post.channelName}
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <h3 className="font-semibold text-gray-900">{post.channelName}</h3>
                  <p className="text-sm text-gray-500">{post.username}</p>
                </div>
              </div>
              <a
                href={`https://t.me/${post.username}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800"
              >
                <ExternalLink className="h-5 w-5" />
              </a>
            </div>

            {/* Content */}
            <div className="mb-4">
              <p className="text-gray-800 whitespace-pre-line">{post.content}</p>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between text-sm text-gray-500">
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <MessageCircle className="h-4 w-4 mr-1" />
                  <span>{post.replies}</span>
                </div>
                <div className="flex items-center">
                  <Repeat2 className="h-4 w-4 mr-1" />
                  <span>{post.forwards}</span>
                </div>
                <div className="flex items-center">
                  <Heart className="h-4 w-4 mr-1" />
                  <span>{post.views}</span>
                </div>
              </div>
              <div className="flex items-center">
                <Share2 className="h-4 w-4 mr-1" />
                <span>{post.timestamp}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TelegramFeed;