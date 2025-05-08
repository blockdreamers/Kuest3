// netlify/functions/fetchTelegram/index.ts

import { Handler } from '@netlify/functions';
import { createClient } from '@supabase/supabase-js';

// ✅ Supabase 환경 변수
const SUPABASE_URL = process.env.SUPABASE_URL!;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// ✅ Supabase 클라이언트 생성
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

const handler: Handler = async (event, context) => {
  try {
    const body = JSON.parse(event.body || '{}');

    if (!Array.isArray(body.messages)) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Invalid message format' }),
      };
    }

    let insertedCount = 0;

    for (const msg of body.messages) {
      const { channel_id, message_id } = msg;

      // ✅ 중복 메시지 체크
      const { data: existing, error: selectError } = await supabase
        .from('telegram_posts')
        .select('id')
        .eq('channel_id', channel_id)
        .eq('message_id', message_id)
        .maybeSingle();

      if (selectError) {
        console.error('🔴 Select error:', selectError.message);
        continue;
      }

      // ✅ 존재하지 않을 경우에만 insert
      if (!existing) {
        const { error: insertError } = await supabase
          .from('telegram_posts')
          .insert([msg]);

        if (insertError) {
          console.error('❌ Insert error:', insertError.message);
        } else {
          insertedCount++;
        }
      }
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, inserted: insertedCount }),
    };
  } catch (err) {
    console.error('💥 Uncaught error:', err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Server error', detail: String(err) }),
    };
  }
};

export { handler };
