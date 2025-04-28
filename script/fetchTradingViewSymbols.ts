// script/fetchTradingViewSymbols.ts

import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';
import axios from 'axios';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const CMC_API_KEY = process.env.CMC_API_KEY!;

// 거래소 우선순위 리스트 (대문자로!)
const preferredExchanges = [
  'BINANCE', 'UPBIT', 'BYBIT', 'KUCOIN', 'BITFINEX', 'BITSTAMP',
  'GATE', 'LBANK', 'MEXC', 'OKX', 'POLONIEX', 'BITGET',
  'COINEX', 'ASCENDEX', 'BITMART'
];

// 슬러그로 마켓페어 가져오기
async function fetchMarketPairs(slug: string) {
  const url = `https://pro-api.coinmarketcap.com/v1/cryptocurrency/market-pairs/latest?slug=${slug}`;

  const { data } = await axios.get(url, {
    headers: { 'X-CMC_PRO_API_KEY': CMC_API_KEY },
    params: { limit: 100 },
  });

  return data.data.market_pairs || [];
}

// Supabase에 저장
async function updateTradingViewSymbol(id: string, symbol: string) {
  const { error } = await supabase
    .from('project_info')
    .update({ tradingview_symbol: symbol })
    .eq('id', id);

  if (error) {
    console.error(`❌ 업데이트 실패 (${id}):`, error.message);
  } else {
    console.log(`✅ 업데이트 완료 (${id}): ${symbol}`);
  }
}

// 메인 함수
async function main() {
  const { data: projects, error } = await supabase
    .from('project_info')
    .select('id, slug')
    .neq('slug', null);

  if (error) {
    console.error('❌ 프로젝트 목록 조회 실패:', error.message);
    return;
  }

  for (const project of projects) {
    try {
      const marketPairs = await fetchMarketPairs(project.slug);

      let selectedSymbol = '';

      for (const exchange of preferredExchanges) {
        const found = marketPairs.find((pair: any) =>
          pair.exchange_name.toUpperCase() === exchange &&
          pair.quote_currency_symbol === 'USDT'
        );

        if (found) {
          selectedSymbol = `${exchange}:${found.base_currency_symbol}USDT`;
          break;
        }
      }

      if (selectedSymbol) {
        await updateTradingViewSymbol(project.id, selectedSymbol);
      } else {
        console.log(`🚫 USDT 마켓 없음: ${project.slug}`);
      }

    } catch (err: any) {
      console.error(`🚨 ${project.slug} 처리 실패: ${err.message}`);
    }

    await new Promise((resolve) => setTimeout(resolve, 3000)); // 3초 딜레이
  }

  console.log('🏁 전체 완료');
}

main();
