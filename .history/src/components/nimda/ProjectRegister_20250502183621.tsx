// src/components/nimda/ProjectRegister.tsx
import React, { useState } from 'react';

const ProjectRegister = () => {
  const [slug, setSlug] = useState('');
  const [nameKo, setNameKo] = useState('');
  const [tvSymbol, setTvSymbol] = useState('');
  const [season, setSeason] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleRegister = async () => {
    if (!slug || !nameKo || !season) {
      setMessage('❌ 필수 정보를 모두 입력해주세요.');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const res = await fetch('/.netlify/functions/registerProject', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug, nameKo, tvSymbol, season }),
      });

      const result = await res.text();

      if (res.ok) {
        setMessage(`✅ 등록 완료: ${result}`);
        setSlug('');
        setNameKo('');
        setTvSymbol('');
        setSeason('');
      } else {
        setMessage(`❌ 등록 실패: ${result}`);
      }
    } catch (err: any) {
      setMessage(`❌ 에러 발생: ${err.message}`);
    }

    setLoading(false);
  };

  return (
    <div className="bg-[#121212] text-white p-6 rounded-lg">
      <h2 className="text-2xl font-bold mb-4">🪙 프로젝트 등록</h2>

      <div className="space-y-4">
        <input
          className="w-full p-2 bg-[#1e1e1e] border border-gray-600 rounded"
          placeholder="CMC Slug (예: bitcoin)"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
        />
        <input
          className="w-full p-2 bg-[#1e1e1e] border border-gray-600 rounded"
          placeholder="한글 코인명"
          value={nameKo}
          onChange={(e) => setNameKo(e.target.value)}
        />
        <input
          className="w-full p-2 bg-[#1e1e1e] border border-gray-600 rounded"
          placeholder="TradingView 심볼 (예: BINANCE:BTCUSDT)"
          value={tvSymbol}
          onChange={(e) => setTvSymbol(e.target.value)}
        />
        <input
          className="w-full p-2 bg-[#1e1e1e] border border-gray-600 rounded"
          placeholder="참여 시즌 (예: S1)"
          value={season}
          onChange={(e) => setSeason(e.target.value)}
        />

        <button
          onClick={handleRegister}
          disabled={loading}
          className="bg-[#C7EB3E] text-black px-4 py-2 rounded font-bold hover:brightness-110 transition"
        >
          {loading ? '등록 중...' : '등록하기'}
        </button>

        {message && <p className="text-sm mt-2">{message}</p>}
      </div>
    </div>
  );
};

export default ProjectRegister;
