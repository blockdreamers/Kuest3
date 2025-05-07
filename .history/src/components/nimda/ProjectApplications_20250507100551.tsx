import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import styles from "./ProjectApplications.module.css";

console.log("🚨 ProjectApplications.tsx 파일이 실행되고 있음");

type Application = {
  id: string;
  name: string;
  name_ko: string;
  slug: string;
  email: string;
  chart_url: string;
  whitepaper: string;
  description: string;
  submitted_at: string;
  status: string;
};

const ProjectApplications = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const navigate = useNavigate();

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
      const json = await res.json();

      console.log("📦 전체 응답 구조 확인:", JSON.stringify(json, null, 2));
      console.log("📦 json.applications 존재 여부:", json.applications !== undefined);
      console.log("📦 Array.isArray(json.applications):", Array.isArray(json.applications));

      if (!res.ok) {
        toast.error("불러오기 실패: " + (json.message || json.error));
        return;
      }

      if (!Array.isArray(json.applications)) {
        console.error("❌ applications는 배열이 아닙니다:", json.applications);
        toast.error("신청 데이터 형식 오류");
        return;
      }

      setApplications(json.applications || []);
      console.log("✅ setApplications 실행됨, 길이:", json.applications.length);
    } catch (err: any) {
      console.error("❌ fetchApplications 예외 발생:", err.message);
      toast.error("네트워크 오류가 발생했습니다.");
    }
  };

  const updateStatus = async (id: string, status: string) => {
    try {
      console.log(`🔄 상태 업데이트 요청: id=${id}, status=${status}`);
      const res = await fetch("/.netlify/functions/updateApplicationStatus", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });

      const json = await res.json();
      if (res.ok) {
        console.log("✅ 상태 업데이트 성공:", json);
        toast.success("상태가 업데이트되었습니다.");
        // 🔁 상태 업데이트 후 다시 조회
        const user = getAuth().currentUser;
        if (user) await fetchApplications(user);
      } else {
        console.error("❌ 상태 업데이트 실패:", json.error);
        toast.error("상태 변경 실패: " + json.error);
      }
    } catch (err: any) {
      console.error("❌ 상태 업데이트 중 예외 발생:", err.message);
      toast.error("업데이트 중 오류 발생");
    }
  };

  const renderActionButtons = (app: Application) => {
    if (app.status === "registered") {
      return <span className={styles.statusTag}>✅ 등록완료</span>;
    }

    return (
      <div className={styles.actions}>
        <button
          className={styles.registerBtn}
          onClick={() => navigate(`/nimda/project-register?slug=${app.slug}`)}
        >
          등록하기
        </button>
        <button
          className={styles.toggleBtn}
          onClick={() =>
            updateStatus(app.id, app.status === "pending" ? "rejected" : "pending")
          }
        >
          {app.status === "pending" ? "승인불가" : "대기중"}
        </button>
      </div>
    );
  };

  useEffect(() => {
    console.log("📍 useEffect 진입 (onAuthStateChanged 등록)");
  
    const unsubscribe = onAuthStateChanged(getAuth(), (user) => {
      console.log("👀 onAuthStateChanged 사용자 상태:", user);
  
      if (!user) {
        console.warn("❗ Firebase 인증되지 않음. 로그인으로 이동");
        navigate("/login");
        return;
      }
  
      // ✅ 인증된 유저가 생기면 200ms 기다렸다가 실행 (auth context 안정화 대기)
      setTimeout(() => {
        console.log("🕒 200ms 후 fetchApplications 실행");
        fetchApplications(user);
      }, 200);
    });
  
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    console.log("📦 [useEffect] applications 상태 변경됨:", applications);
  }, [applications]);

  return (
    <div className={styles.wrapper}>
      <h2 className={styles.title}>🗂 프로젝트 접수 현황</h2>
      <p style={{ color: "#0f0" }}>
        🔢 현재 applications.length: {applications?.length ?? "undefined"}
      </p>
      <div className={styles.list}>
        {applications.length === 0 ? (
          <p className={styles.empty}>등록된 신청이 없습니다.</p>
        ) : (
          <>
            {console.log("🖼 map 직전 applications:", applications)}
            {applications.map((app) => (
              <div key={app.id} className={styles.card}>
                <div>
                  <strong>{app.name}</strong> ({app.name_ko})<br />
                  <span className={styles.slug}>slug: {app.slug}</span><br />
                  📧 {app.email}<br />
                  📝 설명: {app.description || "설명 없음"}<br />
                  📈{" "}
                  <a
                    href={app.chart_url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {app.chart_url || "없음"}
                  </a>
                  <br />
                  📃{" "}
                  <a
                    href={app.whitepaper}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {app.whitepaper || "없음"}
                  </a>
                  <br />
                  ⏰ 제출시각:{" "}
                  {app.submitted_at
                    ? new Date(app.submitted_at).toLocaleString("ko-KR")
                    : "제출시간 없음"}
                </div>
                <div>{renderActionButtons(app)}</div>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
};

export default ProjectApplications;
