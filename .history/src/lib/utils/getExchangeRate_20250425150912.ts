// utils/getExchangeRate.ts
export async function fetchUSDKRW(): Promise<number> {
    try {
      const res = await fetch('https://api.exchangerate.host/latest?base=USD&symbols=KRW');
      const data = await res.json();
      return data.rates.KRW;
    } catch (err) {
      console.error('환율 불러오기 실패:', err);
      return 1350; // fallback 환율
    }
  }
  