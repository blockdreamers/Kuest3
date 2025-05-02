import React, { useEffect, useState } from 'react';
import { usePrivy } from '@privy-io/react-auth';
import {
  User, Mail, Wallet, ExternalLink, Copy, Link as LinkIcon,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { insertUserWallet } from '../lib/auth/supabaseUser';

function Profile() {
  const { user: privyUser, ready: privyReady } = usePrivy();
  const { user: firebaseUser, loading: firebaseLoading } = useAuth();
  const navigate = useNavigate();
  const [walletInserted, setWalletInserted] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);

  // ✅ 로그인 확인
  useEffect(() => {
    if (!firebaseLoading && !firebaseUser) {
      navigate('/login');
    }
  }, [firebaseLoading, firebaseUser, navigate]);

  // ✅ 지갑 주소 확보
  useEffect(() => {
    if (privyReady && privyUser?.wallet?.walletAddress) {
      setWalletAddress(privyUser.wallet.walletAddress);
    }
  }, [privyReady, privyUser]);

  // ✅ Supabase에 지갑 주소 삽입
  useEffect(() => {
    const tryInsertWallet = async () => {
      if (
        firebaseUser &&
        walletAddress &&
        !walletInserted
      ) {
        try {
          await insertUserWallet({
            user_id: firebaseUser.uid,
            wallet_address: walletAddress,
            created_at: new Date().toISOString(),
          });
          setWalletInserted(true);
          console.log('✅ Supabase에 지갑 주소 insert 완료');
        } catch (err) {
          console.error('❌ Supabase 지갑 insert 실패:', err);
        }
      }
    };

    tryInsertWallet();
  }, [firebaseUser, walletAddress, walletInserted]);

  if (firebaseLoading || !firebaseUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
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

                {/* ✅ 지갑 주소 표시 */}
                {walletAddress && (
                  <div className="flex items-center justify-between py-3 border-b">
                    <div className="flex items-center text-gray-600">
                      <Wallet className="h-5 w-5 mr-2" />
                      <span>지갑 주소</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-gray-900">
                        {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
                      </span>
                      <a
                        href={`https://etherscan.io/address/${walletAddress}`}
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

        {/* Right Side Placeholder */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-lg p-6 text-gray-600">
            <h3 className="text-lg font-semibold">포인트 적립 내역</h3>
            <p className="mt-4">준비 중입니다...</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
