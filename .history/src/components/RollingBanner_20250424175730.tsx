import React, { useEffect, useRef, useState } from 'react';
import { ArrowUp, ArrowDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js';
import './RollingBanner.css';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL!;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

type Coin = {
  id: string;
  name: string;
  symbol: string;
  price: number;
  priceChange: number;
  logo: string;
};

const RollingBanner = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [coins, setCoins] = useState<Coin[]>([]);

  useEffect(() => {
    const scrollElement = scrollRef.current;
    if (!scrollElement) return;

    const scroll = () => {
      if (scrollElement.scrollLeft >= scrollElement.scrollWidth / 2) {
        scrollElement.scrollLeft = 0;
      } else {
        scrollElement.scrollLeft += 1;
      }
    };

    const intervalId = setInterval(scroll, 30);
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const fetchCoins = async () => {
      const { data, error } = await supabase
        .from('coin_prices')
        .select('*')
        .order('id', { ascending: true });

      if (error) {
        console.error('❌ DB에서 코인 데이터 조회 실패:', error);
      } else {
        setCoins(data || []);
      }
    };

    fetchCoins();
  }, []);

  const displayCoins = [...coins, ...coins]; // 무한 루프 느낌

  return (
    <div className="bg-white border-y">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
        <div
          ref={scrollRef}
          className="overflow-hidden whitespace-nowrap"
          style={{
            maskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)',
          }}
        >
          <div className="inline-flex space-x-6">
            {displayCoins.map((coin, index) => (
              <Link
                key={`${coin.id}-${index}`}
                to={`/coin/${coin.id}`}
                className="rolling-coin-box"
              >
                <img src={coin.logo} alt={coin.name} className="rolling-logo" />
                <span className="rolling-name">{coin.name}</span>
                <span className="rolling-symbol">{coin.symbol}</span>
                <span className="rolling-price">${coin.price.toLocaleString()}</span>
                <span className={`rolling-change ${coin.priceChange >= 0 ? 'up' : 'down'}`}>
                  {coin.priceChange >= 0 ? (
                    <ArrowUp className="w-3 h-3" />
                  ) : (
                    <ArrowDown className="w-3 h-3" />
                  )}
                  <span className="ml-1">{Math.abs(coin.priceChange).toFixed(2)}%</span>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RollingBanner;
