import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabaseAdmin } from '../../lib/supabaseAdmin';

const UserDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [wallets, setWallets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchUserData = async () => {
      setLoading(true);

      // ✅ users 테이블에서 유저 1명 불러오기
      const { data: userData, error: userError } = await supabaseAdmin
        .from('users')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      // ✅ user_wallets 테이블에서 해당 유저의 지갑들 불러오기
      const { data: walletData, error: walletError } = await supabaseAdmin
        .from('user_wallets')
        .select('*')
        .eq('user_id', id);

      if (userError || walletError) {
        console.error('❌ 데이터 불러오기 실패:', userError || walletError);
      } else {
        setUser(userData);
        setWallets(walletData);
      }

      setLoading(false);
    };

    fetchUserData();
  }, [id]);

  if (loading) return <div className="text-white p-6">불러오는 중...</div>;
  if (!user) return <div className="text-red-500 p-6">유저를 찾을 수 없습니다.</div>;

  return (
    <div className="bg-[#121212] text-white p-6">
      <button onClick={() => navigate(-1)} className="mb-4 text-sm text-[#C7EB3E] hover:underline">
        ← 뒤로가기
      </button>

      <h2 className="text-2xl font-bold mb-2">유저 상세 정보</h2>
      <div className="mb-6 space-y-1">
        <div><strong>UID:</strong> {user.id}</div>
        <div><strong>이메일:</strong> {user.email}</div>
        <div><strong>닉네임:</strong> {user.nickname || '-'}</div>
        <div><strong>유저 타입:</strong> {user.user_type}</div>
        <div><strong>추천 코드:</strong> {user.referral_code || '-'}</div>
        <div><strong>추천인:</strong> {user.referred_by || '-'}</div>
        <div><strong>생성일:</strong> {new Date(user.created_at).toLocaleString()}</div>
        <div><strong>최근 로그인:</strong> {new Date(user.last_login_at).toLocaleString()}</div>
      </div>

      <h3 className="text-xl font-semibold mb-2">연결된 지갑</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm border-t border-gray-700">
          <thead>
            <tr className="text-gray-400 text-left">
              <th className="p-2">주소</th>
              <th className="p-2">Provider</th>
              <th className="p-2">생성일</th>
            </tr>
          </thead>
          <tbody>
            {wallets.map((w) => (
              <tr key={w.id} className="border-t border-gray-700">
                <td className="p-2">{w.wallet_address}</td>
                <td className="p-2">{w.provider}</td>
                <td className="p-2">{new Date(w.created_at).toLocaleString()}</td>
              </tr>
            ))}
            {wallets.length === 0 && (
              <tr>
                <td className="p-2" colSpan={3}>등록된 지갑이 없습니다.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserDetail;
