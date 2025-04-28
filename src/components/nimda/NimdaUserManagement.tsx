import React, { useEffect, useState } from 'react';
import supabase from '@/lib/supabase';

const NimdaUserManagement = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [userTypeFilter, setUserTypeFilter] = useState('전체');
  const [itemsPerPage, setItemsPerPage] = useState(50);

  useEffect(() => {
    const fetchUsers = async () => {
      const { data, error } = await supabase
        .from('users')
        .select(`
          id,
          email,
          user_type,
          last_login_at,
          user_wallets(wallet_address, provider)
        `);

      if (error) {
        console.error('유저 불러오기 실패:', error.message);
        return;
      }
      if (data) {
        setUsers(data);
      }
    };

    fetchUsers();
  }, []);

  const formatDateTime = (datetime: string | null) => {
    if (!datetime) return '-';
    const date = new Date(datetime);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(
      date.getDate(),
    ).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(
      date.getMinutes(),
    ).padStart(2, '0')}`;
  };

  const formatWallet = (wallet: string | null) => {
    if (!wallet) return '-';
    return `${wallet.slice(0, 6)}...${wallet.slice(-4)}`;
  };

  const filteredUsers = users.filter((user) => {
    const matchesEmail = user.email?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = userTypeFilter === '전체' || user.user_type === userTypeFilter;
    return matchesEmail && matchesType;
  });

  return (
    <div className="bg-[#121212] text-white rounded-xl p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <h2 className="text-2xl font-bold">유저 관리</h2>

        <div className="flex flex-wrap items-center gap-2">
          {/* 이메일 검색 */}
          <input
            type="text"
            placeholder="이메일 검색"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-[#1e1e1e] border border-gray-600 rounded-md px-3 py-1 text-sm focus:ring-2 focus:ring-[#C7EB3E]"
          />

          {/* 타입 필터 */}
          <select
            value={userTypeFilter}
            onChange={(e) => setUserTypeFilter(e.target.value)}
            className="bg-[#1e1e1e] border border-gray-600 rounded-md px-3 py-1 text-sm focus:ring-2 focus:ring-[#C7EB3E]"
          >
            <option value="전체">전체</option>
            <option value="normal">Normal</option>
            <option value="kol">KOL</option>
            <option value="project">Project</option>
          </select>

          {/* 페이지 수 선택 */}
          <select
            value={itemsPerPage}
            onChange={(e) => setItemsPerPage(Number(e.target.value))}
            className="bg-[#1e1e1e] border border-gray-600 rounded-md px-3 py-1 text-sm focus:ring-2 focus:ring-[#C7EB3E]"
          >
            <option value={50}>50개</option>
            <option value={100}>100개</option>
            <option value={200}>200개</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-gray-400 text-left">
              <th className="p-2">UID</th>
              <th className="p-2">이메일</th>
              <th className="p-2">유저 타입</th>
              <th className="p-2">지갑 주소</th>
              <th className="p-2">지갑 Provider</th>
              <th className="p-2">최근 로그인</th>
            </tr>
          </thead>

          <tbody>
            {filteredUsers.slice(0, itemsPerPage).map((user) => (
              <tr
                key={user.id}
                className="border-t border-gray-700 hover:bg-[#1e1e1e] transition-colors"
              >
                <td className="p-2 truncate max-w-[200px]">{user.id}</td>
                <td className="p-2 truncate max-w-[200px]">{user.email}</td>
                <td className="p-2">{user.user_type || '-'}</td>
                <td className="p-2">
                  {user.user_wallets?.length > 0
                    ? formatWallet(user.user_wallets[0].wallet_address)
                    : '-'}
                </td>
                <td className="p-2">
                  {user.user_wallets?.length > 0
                    ? user.user_wallets[0].provider
                    : '-'}
                </td>
                <td className="p-2">{formatDateTime(user.last_login_at)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default NimdaUserManagement;
