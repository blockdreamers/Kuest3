import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { auth } from "@/config/firebase";
import styles from "./ProjectApplications.module.css";

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

  const fetchApplications = async () => {
    try {
      const user = auth.currentUser;
      if (!user) {
        console.warn("❗ 인증 유저 없음. 로그인으로 이동");
        navigate("/login");
        return;
      }

      const token = await user.getIdToken();
      const res = await fetch("/.netlify/functions/fetchApplications", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const text = await res.text();
      let json;
      try {
        json = JSON.parse(text);
      } catch (e) {
        console.error("❌ JSON 파싱 실패:", e);
        toast.error("서버 응답 오류 (JSON 오류)");
        return;
      }

      if (!res.ok) {
        toast.error("불러오기 실패: " + (json.message || json.error));
        return;
      }

      if (!Array.isArray(json)) {
        toast.error("형식 오류: 배열이 아님");
        return;
      }

      setApplications(json);
    } catch (err: any) {
      console.error("❌ fetchApplications 오류:", err.message);
      toast.error("프로젝트 신청 데이터 불러오기 실패");
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const updateStatus = async (id: string, status: string) => {
    try {
      const res = await fetch("/.netlify/functions/updateApplicationStatus", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });

      const json = await res.json();
      if (res.ok) {
        toast.success("상태 업데이트 완료");
        fetchApplications();
      } else {
        toast.error("업데이트 실패: " + json.error);
      }
    } catch (err: any) {
      console.error("❌ 상태 업데이트 중 오류:", err.message);
      toast.error("상태 업데이트 중 오류 발생");
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

  return (
    <div className={styles.wrapper}>
      <h2 className={styles.title}>🗂 프로젝트 접수 현황</h2>
      <p style={{ color: "#0f0" }}>
        🔢 현재 applications.length: {applications.length}
      </p>
      <div className={styles.list}>
        {applications.length === 0 ? (
          <p className={styles.empty}>등록된 신청이 없습니다.</p>
        ) : (
          applications.map((app) => (
            <div key={app.id} className={styles.card}>
              <div>
                <strong>{app.name}</strong> ({app.name_ko})<br />
                <span className={styles.slug}>slug: {app.slug}</span><br />
                📧 {app.email}<br />
                📝 설명: {app.description || "설명 없음"}<br />
                📈{" "}
                <a href={app.chart_url} target="_blank" rel="noopener noreferrer">
                  {app.chart_url || "없음"}
                </a><br />
                📃{" "}
                <a href={app.whitepaper} target="_blank" rel="noopener noreferrer">
                  {app.whitepaper || "없음"}
                </a><br />
                ⏰ 제출시각:{" "}
                {app.submitted_at
                  ? new Date(app.submitted_at).toLocaleString("ko-KR")
                  : "제출시간 없음"}
              </div>
              <div>{renderActionButtons(app)}</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ProjectApplications;
