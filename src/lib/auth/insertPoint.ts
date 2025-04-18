import supabase from '../supabase';
import { toast } from 'react-hot-toast';

interface PointEvent {
  user_id: string;
  type: 'earn' | 'redeem';
  amount: number;
  description?: string;
}

export const insertPoint = async ({ user_id, type, amount, description }: PointEvent) => {
  const timestamp = new Date().toISOString();

  const { error: historyError } = await supabase.from('user_point_history').insert({
    user_id,
    type,
    amount,
    description,
    created_at: timestamp,
  });

  if (historyError) {
    console.error('❌ 포인트 기록 실패:', historyError);
    toast.error('포인트 기록에 실패했습니다.');
    throw historyError;
  }

  // 포인트 잔액 테이블 갱신
  const column = type === 'earn' ? 'total_earned' : 'total_used';

  const { error: updateError } = await supabase.rpc('update_user_points', {
    uid: user_id,
    delta: amount,
    field: column,
  });

  if (updateError) {
    console.error('❌ 포인트 합계 갱신 실패:', updateError);
    toast.error('포인트 누적 정보 갱신 실패');
    throw updateError;
  }

  toast.success(`포인트 ${type === 'earn' ? '적립' : '사용'} 완료!`);
};
