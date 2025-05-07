export function formatPriceKRW(valueUSD: number, rate: number): string {
  const valueKRW = valueUSD * rate;

  if (valueKRW < 100) {
    return `${valueKRW.toFixed(2)} 원`; // 소수점 둘째자리
  } else if (valueKRW < 10000) {
    return `${Math.round(valueKRW).toLocaleString()} 원`; // 1원 단위
  } else if (valueKRW < 100000) {
    return `${(Math.round(valueKRW / 10) * 10).toLocaleString()} 원`; // 10원 단위
  } else if (valueKRW < 1000000) {
    return `${(Math.round(valueKRW / 100) * 100).toLocaleString()} 원`; // 100원 단위
  } else {
    return `${(Math.round(valueKRW / 1000) * 1000).toLocaleString()} 원`; // 1000원 단위
  }
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
