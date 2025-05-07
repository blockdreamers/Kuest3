const fetchApplications = async (user: User) => {
  try {
    console.log("🚀 [fetchApplications] 함수 시작");
    console.log("👤 넘겨받은 user 객체:", user);

    const token = await user.getIdToken();
    console.log("🔑 Firebase ID Token:", token);

    const res = await fetch("/.netlify/functions/fetchApplications", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log("🌐 API 응답 상태:", res.status);

    const text = await res.text();
    console.log("🧾 Raw 응답 text:", text);

    let json;
    try {
      json = JSON.parse(text);
    } catch (e) {
      console.error("❌ JSON 파싱 실패:", e);
      toast.error("서버 응답 오류 (JSON 형식 오류)");
      return;
    }

    console.log("📦 전체 응답 구조 확인:", JSON.stringify(json, null, 2));

    if (!res.ok) {
      toast.error("불러오기 실패: " + (json.message || json.error));
      return;
    }

    if (!Array.isArray(json)) {
      console.error("❌ 응답이 배열이 아님:", json);
      toast.error("신청 데이터 형식 오류");
      return;
    }

    setApplications(json);
    console.log("✅ setApplications 실행됨, 길이:", json.length);
  } catch (err: any) {
    console.error("❌ fetchApplications 예외 발생:", err.message);
    toast.error("네트워크 오류가 발생했습니다.");
  }
};
