// script/fetchCoins.ts
import axios from 'axios';
import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const fetchCoins = async () => {
  try {
    const response = await axios.get('https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest', {
      headers: {
        'X-CMC_PRO_API_KEY': process.env.CMC_API_KEY!,
      },
      params: {
        start: 1,
        limit: 10,
        convert: 'USD',
      },
    });

    const coins = response.data.data.map((coin: any) => ({
      id: coin.slug, // CoinMarketCap slug (e.g., bitcoin)
      name: coin.name,
      symbol: coin.symbol,
      price: coin.quote.USD.price,
      priceChange: coin.quote.USD.percent_change_24h,
      logo: `https://s2.coinmarketcap.com/static/img/coins/64x64/${coin.id}.png`,
      updated_at: new Date().toISOString()
    }));

    const { error } = await supabase
      .from('coin_banners')
      .upsert(coins, { onConflict: ['id'] });

    if (error) throw error;

    console.log('✅ 코인 데이터 저장 완료:', coins.map(c => c.id).join(', '));
  } catch (err) {
    console.error('❌ 에러 발생:', err);
  }
};

fetchCoins();
