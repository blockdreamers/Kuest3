import axios from 'axios';
import { createClient } from '@supabase/supabase-js';
import 'dotenv/config'; // 꼭 최상단에 있어야 함


const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_KEY!);

const fetchCoins = async () => {
  try {
    const response = await axios.get('https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest', {
      headers: {
        'X-CMC_PRO_API_KEY': process.env.CMC_API_KEY!,
      },
      params: {
        start: 1,
        limit: 50,
        convert: 'USD',
      },
    });

    const coins = response.data.data.map((coin: any) => ({
      id: coin.slug,
      name: coin.name,
      symbol: coin.symbol,
      logo: `https://s2.coinmarketcap.com/static/img/coins/64x64/${coin.id}.png`,
      price: coin.quote.USD.price,
      price_change_24h: coin.quote.USD.percent_change_24h,
      updated_at: new Date().toISOString(),
    }));

    const { error } = await supabase
      .from('coin_prices')
      .upsert(coins, { onConflict: ['id'] });

    if (error) throw error;

    console.log('✅ coin_prices 테이블 업데이트 완료');
  } catch (err) {
    console.error('❌ 에러 발생:', err);
  }
};

fetchCoins();
