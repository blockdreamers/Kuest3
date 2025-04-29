import { Handler } from '@netlify/functions';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL!;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const handler: Handler = async (event) => {
  try {
    // ✅ 인증 토큰 꺼내기
    const authHeader = event.headers.authorization || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;

    if (!token) {
      return {
        statusCode: 401,
        body: JSON.stringify({ message: 'No authorization token found' }),
      };
    }

    // ✅ 토큰으로 Supabase user 가져오기
    const { data: user, error } = await supabase.auth.getUser(token);

    if (error || !user?.user) {
      console.error('Supabase 인증 실패:', error?.message);
      return {
        statusCode: 401,
        body: JSON.stringify({ message: 'Invalid or expired token' }),
      };
    }

    const userId = user.user.id;

    // ✅ 유저 id로 user_type 조회
    const { data, error: userError } = await supabase
      .from('users')
      .select('user_type')
      .eq('id', userId)
      .maybeSingle();

    if (userError) {
      console.error('Supabase users 조회 실패:', userError.message);
      return {
        statusCode: 500,
        body: JSON.stringify({ message: 'Failed to fetch user_type' }),
      };
    }

    if (!data) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: 'User not found' }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ user_type: data.user_type }),
    };
  } catch (err: any) {
    console.error('Function 실행 실패:', err.message);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal server error' }),
    };
  }
};

export { handler };
