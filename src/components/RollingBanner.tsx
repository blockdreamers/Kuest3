import React, { useEffect, useRef, useState } from 'react';
import { ArrowUp, ArrowDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js';
import { coinNameMap } from "../lib/data/coinNameMap";
import { formatPriceKRW } from "../lib/utils/formatKRW"; // ✨ 추가
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
  const [exchangeRate, setExchangeRate] = useState<number>(1420); // ✨ 환율 기본값 임시 (1달러=1420원)

  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase
        .from('coin_prices')
        .select('*')
        .order('id');
      if (!error && data) setCoins([...data, ...data]); // 무한 스크롤용 복제
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
        el.scrollLeft += 2;
      }
    };

    const intervalId = setInterval(scroll, 20);
    return () => clearInterval(intervalId);
  }, []);

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
            {coins.map((coin, index) => {
              const priceUSD = Number(coin.price);
              const percentChange = Number(coin.price_change_24h);
              const isUp = percentChange >= 0;

              const koreanName = coinNameMap[coin.symbol] || coin.name;

              // ✨ 가격을 KRW로 변환
              const priceKRW = formatPriceKRW(priceUSD, exchangeRate);

              return (
                <Link
                  key={`${coin.id}-${index}`}
                  to={`/coin/${coin.id}`}
                  className="rolling-coin-box"
                >
                  <img src={coin.logo} alt={coin.name} className="rolling-logo" />
                  <span className="rolling-name">{koreanName}</span>
                  <span className="rolling-symbol">{coin.symbol}</span>
                  <span className="rolling-price flicker">{priceKRW}</span> {/* ✨ 수정 */}
                  <span className={`rolling-change ${isUp ? 'up' : 'down'} flicker`}>
                    {isUp ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
                    <span className="ml-1">{Math.abs(percentChange).toFixed(2)}%</span>
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
