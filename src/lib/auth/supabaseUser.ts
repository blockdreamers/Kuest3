// src/lib/auth/supabaseUser.ts

import { supabaseAdmin } from '../supabaseAdmin';

export const insertSupabaseUser = async ({
  id,
  email,
  nickname,
  photo,
  user_type,
  created_at,
  last_login_at,
  is_active,
}: {
  id: string;
  email: string;
  nickname: string | null;
  photo: string | null;
  user_type: string;
  created_at?: string;
  last_login_at?: string;
  is_active: boolean;
}) => {
  // ✅ 중복 삽입 방지용 사전 확인
  const { data: existingUser, error: checkError } = await supabaseAdmin
    .from('users')
    .select('id')
    .eq('id', id)
    .maybeSingle();

  if (checkError) throw checkError;
  if (existingUser) {
    console.log('⚠️ 이미 존재하는 사용자, insert 생략');
    return;
  }

  const now = new Date().toISOString();

  const { data, error } = await supabaseAdmin.from('users').insert([
    {
      id,
      email,
      nickname,
      photo,
      user_type,
      created_at: created_at ?? now,
      last_login_at: last_login_at ?? now,
      is_active,
    },
  ]);

  if (error) {
    console.error('❌ [admin] 유저 insert 실패:', error.message);
    throw error;
  }

  console.log('✅ [admin] 유저 insert 성공:', data);
};

export const insertUserWallet = async ({
  user_id,
  wallet_address,
  created_at,
  provider = 'privy',
}: {
  user_id: string;
  wallet_address: string;
  created_at: string;
  provider?: string;
}) => {
  const { data, error } = await supabaseAdmin
    .from('user_wallets')
    .insert([{ user_id, wallet_address, created_at, provider }]);

  if (error) {
    console.error('❌ [admin] 지갑 insert 실패:', error.message);
    throw error;
  }

  console.log('✅ [admin] 지갑 insert 성공:', data);
};
