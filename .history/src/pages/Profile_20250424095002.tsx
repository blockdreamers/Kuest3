import React, { useEffect, useState } from 'react';
import { usePrivy } from '@privy-io/react-auth';
import { User, Mail, Wallet, ExternalLink, Copy, Link as LinkIcon } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { insertUserWallet } from '../lib/auth/supabaseUser';
import styles from './Profile.module.css';

function Profile() {
  const { user: privyUser, ready: privyReady, login: privyLogin } = usePrivy();
  const { user: firebaseUser, loading: firebaseLoading } = useAuth();
  const navigate = useNavigate();
  const [walletInserted, setWalletInserted] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);

  useEffect(() => {
    if (!firebaseLoading && !firebaseUser) {
      navigate('/login');
    }
  }, [firebaseLoading, firebaseUser, navigate]);

  useEffect(() => {
    if (privyReady && privyUser?.wallet?.walletAddress) {
      setWalletAddress(privyUser.wallet.walletAddress);
    }
  }, [privyReady, privyUser]);

  useEffect(() => {
    const tryInsertWallet = async () => {
      if (firebaseUser && walletAddress && !walletInserted) {
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

  const referralLink = "https://www.fl3x.ai/referral/ab97dh1i29yuddj";

  const shortWallet = (address: string) => `${address.slice(0, 4)}...${address.slice(-4)}`;

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
                  <div className="flex items-center justify-end gap-2">
                    {walletAddress ? (
                      <>
                        <span className={styles.profileValue}>{shortWallet(walletAddress)}</span>
                        <a
                          href={`https://etherscan.io/address/${walletAddress}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      </>
                    ) : (
                      <>
                        <span className={styles.profileValue}>지갑이 연결되어 있지 않습니다</span>
                        <button
                          onClick={() => privyLogin()}
                          className="bg-black text-white text-sm px-4 py-1 rounded-lg"
                          style={{ backgroundColor: '#000', color: '#fff' }}
                        >
                          지갑 연결하기
                        </button>
                      </>
                    )}
                  </div>
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