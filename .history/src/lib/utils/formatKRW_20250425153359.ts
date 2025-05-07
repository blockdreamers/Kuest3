export function formatPriceKRW(valueUSD: number, rate: number): string {
    const valueKRW = valueUSD * rate;
    return valueKRW < 10
      ? `${valueKRW.toFixed(2)} 원`
      : `${Math.round(valueKRW).toLocaleString()} 원`;
  }
  
  export function formatMarketCapKRW(valueUSD: number, rate: number): string {
    const valueKRW = valueUSD * rate;
    return `${(valueKRW / 1e8).toLocaleString(undefined, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 1,
    })} 억원`;
  }
  
  export function formatVolumeKRW(valueUSD: number, rate: number): string {
    const valueKRW = valueUSD * rate;
    return `${(valueKRW / 1e6).toLocaleString(undefined, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 1,
    })} 백만원`;
  }
  