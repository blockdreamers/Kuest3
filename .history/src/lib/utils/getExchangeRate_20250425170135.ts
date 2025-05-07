// utils/getExchangeRate.ts

let lastSuccessfulRate: number = 14200; // 초기 기본값

export async function fetchUSDKRW(): Promise<number> {
  try {
    const res = await fetch('https://api.exchangerate.host/latest?base=USD&symbols=KRW');
    const data = await res.json();

    if (data?.rates?.KRW) {
      lastSuccessfulRate = data.rates.KRW; // 성공한 값 저장
      return data.rates.KRW;
    } else {
      throw new Error('KRW 환율이 응답에 없음');
    }
  } catch (err) {
    console.error('❌ 환율 불러오기 실패, 마지막 성공한 환율로 대체됨:', err);
    return lastSuccessfulRate;
  }
}
