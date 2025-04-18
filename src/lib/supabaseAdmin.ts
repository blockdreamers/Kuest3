import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  import.meta.env.VITE_SUPABASE_URL!,
  import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY! // 🔐 중요: 절대 client에 노출되면 안됨
);

export default supabaseAdmin;
