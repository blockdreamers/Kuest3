// lib/auth/supabaseUser.ts

import supabase from '../supabase';
import { toast } from 'react-hot-toast';

interface SupabaseUserPayload {
  id: string;
  email: string | null;
  display_name: string | null;
  photo_url: string | null;
  user_type?: string;
  created_at?: string;
  last_login_at?: string;
  is_active?: boolean;
}

interface WalletPayload {
  user_id: string;
  wallet_address: string;
  created_at?: string;
}

export const insertSupabaseUser = async (user: SupabaseUserPayload) => {
  const { error } = await supabase.from('users').insert(user);

  if (error) {
    console.error('❌ userInsertError:', error.message, error.details);
    toast.error(`회원 정보 저장 실패: ${error.message}`);
    throw error;
  }

  console.log('✅ Supabase 유저 저장 성공');
};

export const insertUserWallet = async (wallet: WalletPayload) => {
  const { error } = await supabase.from('user_wallets').insert(wallet);

  if (error) {
    console.error('❌ walletInsertError:', error.message, error.details);
    toast.error(`지갑 정보 저장 실패: ${error.message}`);
    throw error;
  }

  console.log('✅ Supabase 지갑 저장 성공');
};
