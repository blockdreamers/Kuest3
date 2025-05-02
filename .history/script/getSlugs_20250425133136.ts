// script/getSlugs.ts

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function getSlugs(): Promise<string[]> {
  const { data, error } = await supabase
    .from('project_info')
    .select('slug')
    .neq('slug', null); // null 슬러그 제거

  if (error) {
    console.error('🚨 Supabase에서 slug 불러오기 실패:', error.message);
    return [];
  }

  const slugs = data.map((item) => item.slug);
  console.log('✅ 불러온 slugs:', slugs);
  return slugs;
}
