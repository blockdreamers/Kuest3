// src/lib/utils/insertUserLog.ts
import { supabaseAdmin } from '@/lib/supabaseAdmin';

type LogParams = {
  user_id: string;
  action: string;
  category?: string;
  performed_by?: string;
  metadata?: Record<string, any>;
};

export const insertUserLog = async ({
  user_id,
  action,
  category = 'general',
  performed_by,
  metadata = {},
}: LogParams) => {
  const { error } = await supabaseAdmin.from('user_logs').insert([
    {
      user_id,
      action,
      category,
      performed_by: performed_by || user_id,
      metadata,
    },
  ]);

  if (error) {
    console.error('❌ 로그 저장 실패:', error.message);
  } else {
    console.log('✅ 유저 로그 저장 완료:', action);
  }
};
