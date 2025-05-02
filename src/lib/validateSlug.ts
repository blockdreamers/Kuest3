export const extractSlug = (url: string): string => {
  const match = url.match(/coinmarketcap\.com\/currencies\/([^/]+)/);
  return match ? match[1] : "";
};

// ✅ Netlify Functions를 통한 CMC slug 유효성 검증
export const validateSlugWithCMC = async (slug: string): Promise<boolean> => {
  try {
    const res = await fetch("/.netlify/functions/validateSlug", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug }),
    });

    const json = await res.json();
    return res.ok && json.valid === true;
  } catch (err) {
    console.error("🔴 Client validateSlug Error:", err);
    return false;
  }
};
