export function formatPriceKRW(valueUSD: number, rate: number): string {
    const valueKRW = valueUSD * rate;
    return `₩${Math.round(valueKRW).toLocaleString()}`;
  }
  
  export function formatMarketCapKRW(valueUSD: number, rate: number): string {
    const valueKRW = valueUSD * rate;
    return `${(valueKRW / 1e8).toFixed(1)}억`;
  }
  
  export function formatVolumeKRW(valueUSD: number, rate: number): string {
    const valueKRW = valueUSD * rate;
    return `${(valueKRW / 1e6).toFixed(1)}백만`;
  }
  