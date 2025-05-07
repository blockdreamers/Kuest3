// src/components/RollingBanner.tsx

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

  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase.from('coin_prices').select('*').order('id');
      if (!error && data) setCoins([...data, ...data]); // 두 배로 만들어 무한 롤링
    };
    fetchData();
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const scroll = () => {
      if (el.scrollLeft >= el.scrollWidth / 2) {
        el.scrollLeft = 0;
      } else {
        el.scrollLeft += 2; // 더 빠르게 이동
      }
    };

    const intervalId = setInterval(scroll, 20); // 스피드 조정
    return () => clearInterval(intervalId);
  }, []);

  // 드래그 스크롤
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
            maskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)',
          }}
        >
          <div className="inline-flex space-x-6">
            {coins.map((coin, index) => (
              <Link
                key={`${coin.id}-${index}`}
                to={`/coin/${coin.id}`}
                className="rolling-coin-box"
              >
                <img src={coin.logo} alt={coin.name} className="rolling-logo" />
                <span className="rolling-name">{coin.name}</span>
                <span className="rolling-symbol">{coin.symbol}</span>
                <span className="rolling-price flicker">
                  ${Number(coin.price).toFixed(2)}
                </span>
                <span className={`rolling-change ${coin.priceChange >= 0 ? 'up' : 'down'} flicker`}>
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
