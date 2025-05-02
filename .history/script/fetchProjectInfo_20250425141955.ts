import { createClient } from '@supabase/supabase-js';
import fetch from 'node-fetch';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

const cmcApiKey = process.env.CMC_API_KEY!;
const headers = {
  'X-CMC_PRO_API_KEY': cmcApiKey,
};

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// ✅ 정적 정보 (최초 1회만 호출)
async function fetchInfoData(slug: string) {
  const res = await fetch(
    `https://pro-api.coinmarketcap.com/v1/cryptocurrency/info?slug=${slug}`,
    { headers }
  );
  if (!res.ok) throw new Error(`info fetch 실패: ${slug}`);
  const json = await res.json();
  const data = Object.values(json.data)[0];

  return {
    name: data.name,
    symbol: data.symbol,
    logo: data.logo,
    description: data.description,
    website: data.urls?.website?.[0] ?? null,
    discord: data.urls?.chat?.find((u: string) => u.includes('discord')) ?? null,
    telegram: data.urls?.chat?.find((u: string) => u.includes('t.me')) ?? null,
    twitter: data.urls?.twitter?.[0] ?? null,
    reddit: data.urls?.reddit?.[0] ?? null,
    github: data.urls?.source_code?.[0] ?? null,
    whitepaper: data.urls?.technical_doc?.[0] ?? null,
  };
}

// ✅ 동적 정보 (매번 호출)
async function fetchQuotesData(slug: string) {
  const res = await fetch(
    `https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?slug=${slug}`,
    { headers }
  );
  if (!res.ok) throw new Error(`quotes fetch 실패: ${slug}`);
  const json = await res.json();
  const data = Object.values(json.data)[0];

  const price = data.quote.USD.price;
  const marketCap = data.quote.USD.market_cap;
  const volume = data.quote.USD.volume_24h;
  const priceChange = data.quote.USD.percent_change_24h;
  const circulatingSupply = data.circulating_supply;
  const maxSupply = data.max_supply;
  const fdv = data.quote.USD.fully_diluted_market_cap;
  const volumeMarketCap = marketCap ? volume / marketCap : null;
  const updatedAt = data.last_updated;

  return {
    price,
    price_change: priceChange,
    market_cap: marketCap,
    volume,
    circulating_supply: circulatingSupply,
    max_supply: maxSupply,
    fdv,
    volume_market_cap: volumeMarketCap,
    updated_at: updatedAt,
  };
}

// ✅ Supabase에서 slug 목록 가져오기
async function getSlugs(): Promise<string[]> {
  const { data, error } = await supabase
    .from('project_info')
    .select('slug')
    .neq('slug', null);

  if (error) {
    console.error('❌ 슬러그 불러오기 실패:', error.message);
    return [];
  }

  return data.map((item) => item.slug);
}

// ✅ Supabase에 upsert
async function upsertProjectInfo(record: any) {
  const { error } = await supabase
    .from('project_info')
    .upsert(record, { onConflict: 'slug' });

  if (error) {
    console.error(`❌ 업서트 실패 (${record.slug}):`, error.message);
  } else {
    console.log(`✅ 업서트 성공: ${record.slug}`);
  }
}

// ✅ slug 1개에 대한 full fetch & upsert
async function updateProject(slug: string) {
  // 정적 정보는 존재할 경우 생략
  const { data: existing } = await supabase
    .from('project_info')
    .select('name')
    .eq('slug', slug)
    .single();

  let staticData = {};
  if (!existing?.name) {
    staticData = await fetchInfoData(slug);
  }

  const dynamicData = await fetchQuotesData(slug);

  await upsertProjectInfo({
    id: slug,
    slug,
    ...staticData,
    ...dynamicData,
  });
}

// ✅ 메인 함수: 재시도 포함
async function main() {
  const slugs = await getSlugs();
  const failed: string[] = [];
  const retry1: string[] = [];
  const retry2: string[] = [];

  console.log(`🎯 1차 수집 시작 (${slugs.length}개)`);

  for (const slug of slugs) {
    try {
      await updateProject(slug);
    } catch (err: any) {
      console.error(`🚨 1차 실패: ${slug}`);
      failed.push(slug);
    }
    await wait(2000);
  }

  if (failed.length > 0) {
    console.log(`🔁 2차 재시도 (${failed.length}개)`);
    for (const slug of failed) {
      try {
        await updateProject(slug);
      } catch (err: any) {
        console.error(`🚨 2차 실패: ${slug}`);
        retry1.push(slug);
      }
      await wait(4000);
    }
  }

  if (retry1.length > 0) {
    console.log(`🔁 3차 최종 재시도 (${retry1.length}개)`);
    for (const slug of retry1) {
      try {
        await updateProject(slug);
        console.log(`✅ 최종 성공: ${slug}`);
      } catch (err: any) {
        console.error(`❌ 최종 실패: ${slug}`);
        retry2.push(slug);
      }
      await wait(6000);
    }
  }

  if (retry2.length > 0) {
    console.log(`😓 최종 실패한 slug들 (${retry2.length}개):`, retry2);
  }

  console.log('✅ 전체 사이클 완료!');
}

main();
