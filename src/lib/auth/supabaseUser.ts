import supabaseAdmin from '../supabaseAdmin';
import { toast } from 'react-hot-toast';

// 🔹 유저 정보 타입
interface SupabaseUserPayload {
  id: string;
  email: string | null;
  nickname: string | null;
  photo: string | null;
  user_type?: string;
  created_at?: string;
  last_login_at?: string;
  is_active?: boolean;
}

// 🔹 지갑 정보 타입
interface WalletPayload {
  user_id: string;
  wallet_address: string;
  created_at?: string;
}

// ✅ Supabase users 테이블에 유저 삽입
export const insertSupabaseUser = async (user: SupabaseUserPayload) => {
  console.log('🟡 Supabase에 저장할 user:', user);

  try {
    const { error } = await supabaseAdmin.from('users').insert(user);
    if (error) {
      console.error('❌ userInsertError:', error.message, error.details);
      toast.error(`회원 정보 저장 실패: ${error.message}`);
      throw error;
    }

    console.log('✅ Supabase 유저 저장 성공');
  } catch (err: any) {
    console.error('🔥 insertSupabaseUser 실행 중 예외 발생:', err);
    toast.error('회원 정보 저장 중 예외가 발생했습니다.');
  }
};

// ✅ Supabase user_wallets 테이블에 지갑 삽입
export const insertUserWallet = async (wallet: WalletPayload) => {
  console.log('🟡 Supabase에 저장할 wallet:', wallet);

  // ✅ 값 유효성 사전 검사
  if (!wallet.user_id || !wallet.wallet_address) {
    console.error('⛔ 유효하지 않은 wallet payload:', wallet);
    toast.error('지갑 정보가 누락되었습니다.');
    return;
  }

  try {
    const { error } = await supabaseAdmin.from('user_wallets').insert(wallet);
    if (error) {
      console.error('❌ walletInsertError:', error.message, error.details);
      toast.error(`지갑 정보 저장 실패: ${error.message}`);
      throw error;
    }

    console.log('✅ Supabase 지갑 저장 성공');
  } catch (err: any) {
    console.error('🔥 insertUserWallet 실행 중 예외 발생:', err);
    toast.error('지갑 정보 저장 중 예외가 발생했습니다.');
  }
};
