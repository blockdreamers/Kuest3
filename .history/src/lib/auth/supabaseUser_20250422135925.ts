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
  created_at: string;
  last_login_at: string;
  is_active: boolean;
}) => {
  const { data, error } = await supabaseAdmin
    .from('users')
    .insert([
      {
        id,
        email,
        nickname,
        photo,
        user_type,
        created_at,
        last_login_at,
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
