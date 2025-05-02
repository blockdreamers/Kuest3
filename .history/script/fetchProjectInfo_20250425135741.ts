import { createClient } from '@supabase/supabase-js';
import fetch from 'node-fetch';

// Supabase setup
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// CoinMarketCap setup
const cmcApiKey = process.env.CMC_API_KEY!;
const headers = {
  'X-CMC_PRO_API_KEY': cmcApiKey,
};

// 1. Supabase에서 slug 목록 불러오기
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

// 2. 코인 정보 가져오기 (정적 + 동적)
async function fetchCoinData(slug: string) {
  // 동적 정보
  const quotesRes = await fetch(
    `https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?slug=${slug}`,
    { headers }
  );
  if (!quotesRes.ok) throw new Error(`quotes fetch 실패: ${slug}`);
  const quotesJson = await quotesRes.json();
  const quotesData = Object.values(quotesJson.data)[0];

  // 정적 정보
  const infoRes = await fetch(
    `https://pro-api.coinmarketcap.com/v1/cryptocurrency/info?slug=${slug}`,
    { headers }
  );
  if (!infoRes.ok) throw new Error(`info fetch 실패: ${slug}`);
  const infoJson = await infoRes.json();
  const infoData = Object.values(infoJson.data)[0];

  // 데이터 정리
  const price = quotesData.quote.USD.price;
  const marketCap = quotesData.quote.USD.market_cap;
  const volume = quotesData.quote.USD.volume_24h;
  const priceChange = quotesData.quote.USD.percent_change_24h;
  const circulatingSupply = quotesData.circulating_supply;
  const maxSupply = quotesData.max_supply;
  const fdv = quotesData.quote.USD.fully_diluted_market_cap;
  const volumeMarketCap = marketCap ? volume / marketCap : null;
  const updatedAt = quotesData.last_updated;

  const staticData = {
    name: infoData.name,
    symbol: infoData.symbol,
    logo: infoData.logo,
    description: infoData.description,
    website: infoData.urls?.website?.[0] ?? null,
    discord: infoData.urls?.chat?.find((u: string) => u.includes('discord')) ?? null,
    telegram: infoData.urls?.chat?.find((u: string) => u.includes('t.me')) ?? null,
    twitter: infoData.urls?.twitter?.[0] ?? null,
    reddit: infoData.urls?.reddit?.[0] ?? null,
    github: infoData.urls?.source_code?.[0] ?? null,
    whitepaper: infoData.urls?.technical_doc?.[0] ?? null,
  };

  const dynamicData = {
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

  return { id:slug, ...staticData, ...dynamicData };
}

// 3. Supabase에 upsert
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

// 4. 실행 함수
async function main() {
  const slugs = await getSlugs();

  for (const slug of slugs) {
    try {
      const data = await fetchCoinData(slug);
      await upsertProjectInfo(data);
      await new Promise((r) => setTimeout(r, 1000)); // 1초 delay
    } catch (err: any) {
      console.error(`🚨 처리 실패 (${slug}):`, err.message);
    }
  }
}

main();
