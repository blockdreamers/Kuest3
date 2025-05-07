import React, { useEffect, useRef, useState } from 'react';
import { ArrowUp, ArrowDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js';
import './RollingBanner.css';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL!,
  import.meta.env.VITE_SUPABASE_ANON_KEY!
);

const RollingBanner = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  const [coins, setCoins] = useState<any[]>([]);

  // Supabase에서 코인 데이터 fetch
  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase
        .from('coin_prices')
        .select('*')
        .order('id');
      if (!error && data) {
        setCoins([...data, ...data]); // 무한 롤링용 두 배 배열
      }
    };
    fetchData();
  }, []);

  // 자동 스크롤
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const scroll = () => {
      if (el.scrollLeft >= el.scrollWidth / 2) {
        el.scrollLeft = 0;
      } else {
        el.scrollLeft += 2; // 속도 증가
      }
    };

    const intervalId = setInterval(scroll, 20);
    return () => clearInterval(intervalId);
  }, []);

  // 마우스 드래그 지원
  const handleMouseDown = (e: React.MouseEvent) => {
    const el = scrollRef.current;
    if (!el) return;
    isDragging.current = true;
    startX.current = e.pageX - el.offsetLeft;
    scrollLeft.current = el.scrollLeft;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    const el = scrollRef.current;
    if (!el || !isDragging.current) return;
    e.preventDefault();
    const x = e.pageX - el.offsetLeft;
    const walk = (x - startX.current) * 1.5;
    el.scrollLeft = scrollLeft.current - walk;
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  return (
    <div className="bg-white border-y">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
        <div
          ref={scrollRef}
          className="overflow-hidden whitespace-nowrap cursor-grab"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          style={{
            maskImage:
              'linear-gradient(to right, transparent, black 10%, black 90%, transparent)',
          }}
        >
          <div className="inline-flex space-x-6">
            {coins.map((coin, index) => {
              const price = Number(coin.price);
              const priceChange = Number(coin.priceChange);
              const previousPrice = price - priceChange;
              const percentChange =
                previousPrice !== 0
                  ? (priceChange / previousPrice) * 100
                  : 0;

              return (
                <Link
                  key={`${coin.id}-${index}`}
                  to={`/coin/${coin.id}`}
                  className="rolling-coin-box"
                >
                  <img
                    src={coin.logo}
                    alt={coin.name}
                    className="rolling-logo"
                  />
                  <span className="rolling-name">{coin.name}</span>
                  <span className="rolling-symbol">{coin.symbol}</span>
                  <span className="rolling-price flicker">
                    ${price.toFixed(2)}
                  </span>
                  <span
                    className={`rolling-change ${
                      percentChange >= 0 ? 'up' : 'down'
                    } flicker`}
                  >
                    {percentChange >= 0 ? (
                      <ArrowUp className="w-3 h-3" />
                    ) : (
                      <ArrowDown className="w-3 h-3" />
                    )}
                    <span className="ml-1">
                      {Math.abs(percentChange).toFixed(2)}%
                    </span>
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RollingBanner;
