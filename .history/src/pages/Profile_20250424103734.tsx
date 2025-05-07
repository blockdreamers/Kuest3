import React, { useEffect, useState } from 'react';
import { usePrivy } from '@privy-io/react-auth';
import {
  User,
  Mail,
  Wallet,
  ExternalLink,
  Copy,
  Link as LinkIcon,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { insertUserWallet } from '../lib/auth/supabaseUser';
import styles from './Profile.module.css';

function Profile() {
  const {
    user: privyUser,
    ready: privyReady,
    login: privyLogin,
  } = usePrivy();
  const { user: firebaseUser, loading: firebaseLoading } = useAuth();
  const navigate = useNavigate();

  const [walletInserted, setWalletInserted] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);

  // 🔍 Privy 상태 디버깅
  console.log('🔁 Privy Ready 상태:', privyReady);

  useEffect(() => {
    console.log('🔍 [Privy 디버깅] 전체 user 객체:', privyUser);
    if (privyUser?.wallet?.walletAddress) {
      console.log('✅ [Privy 디버깅] 지갑 주소 확보됨:', privyUser.wallet.walletAddress);
      setWalletAddress(privyUser.wallet.walletAddress);
    } else {
      console.log('❌ [Privy 디버깅] 지갑 주소 없음 (privyUser.wallet 미정의 또는 비어있음)');
    }
  }, [privyUser?.wallet?.walletAddress]);

  // 🔁 지갑 연결 버튼 클릭 시 세션 초기화 + 강제 로그인
  const handleReconnect = async () => {
    try {
      localStorage.clear();
      sessionStorage.clear();
      console.log('🧹 로컬 스토리지 초기화 완료, 로그인 시도');
      await privyLogin({ forceLogin: true });
    } catch (err) {
      console.error('❌ [Privy] 재로그인 실패:', err);
    }
  };

  // 로그인 안됐으면 리디렉션
  useEffect(() => {
    if (!firebaseLoading && !firebaseUser) {
      navigate('/login');
    }
  }, [firebaseLoading, firebaseUser, navigate]);

  // Supabase에 wallet 주소 insert
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
      <div className={styles.loadingWrapper}>
        <div className={styles.spinner}></div>
      </div>
    );
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const referralLink = 'https://www.fl3x.ai/referral/ab97dh1i29yuddj';

  return (
    <div className={styles.profileContainer}>
      <div className={styles.profileGrid}>
        <div>
          <div className={styles.profileBox}>
            <div className={styles.profileCenter}>
              {firebaseUser.photoURL ? (
                <img src={firebaseUser.photoURL} alt={firebaseUser.email || ''} className={styles.profileAvatar} />
              ) : (
                <div className={styles.profileFallback}>
                  <User className="h-12 w-12 text-white" />
                </div>
              )}
              <h2 className={styles.profileName}>{firebaseUser.email?.split('@')[0] || '사용자'}</h2>

              <div className={styles.profileSection}>
                <div className={styles.profileRow}>
                  <div className={styles.profileLabel}>
                    <Wallet className="h-5 w-5 mr-2" /> 지갑 주소
                  </div>
                  {walletAddress ? (
                    <div className="flex items-center">
                      <span className={styles.profileValue}>
                        {walletAddress.slice(0, 4)}...{walletAddress.slice(-4)}
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
                  ) : (
                    <button onClick={handleReconnect} className={styles.walletConnectButton}>
                      지갑 연결하기
                    </button>
                  )}
                </div>

                <Link to="/social-accounts" className={styles.profileLink}>
                  <div className={styles.profileLabel}>
                    <LinkIcon className="h-5 w-5 mr-2" /> SNS 계정 연동
                  </div>
                  <ExternalLink className="h-4 w-4 text-gray-400" />
                </Link>

                <div className={styles.profileRow}>
                  <div className={styles.profileLabel}>
                    <Mail className="h-5 w-5 mr-2" /> 이메일
                  </div>
                  <span className={styles.profileValue}>{firebaseUser.email}</span>
                </div>
              </div>
            </div>
          </div>

          <div className={`${styles.profileBox} mt-6`}>
            <h3 className={styles.referralTitle}>레퍼럴 프로그램</h3>
            <div className={styles.referralGrid}>
              <span className="text-gray-600">초대한 친구</span>
              <span className="font-semibold">123명</span>
            </div>
            <label className="text-sm text-gray-600 mb-2 block">나의 레퍼럴 링크</label>
            <div className={styles.referralInputWrapper}>
              <input
                type="text"
                value={referralLink}
                readOnly
                className={styles.referralInput}
              />
              <button onClick={() => copyToClipboard(referralLink)} className={styles.referralBtn}>
                <Copy className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        <div>
          <div className={styles.pointsBox}>
            <h3>포인트 적립 내역</h3>
            <p>준비 중입니다...</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
