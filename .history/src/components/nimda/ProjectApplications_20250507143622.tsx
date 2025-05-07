// src/components/nimda/ProjectApplications.tsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { auth } from "@/config/firebase";

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
  const [expandedRows, setExpandedRows] = useState<string[]>([]);
  const [modalAppId, setModalAppId] = useState<string | null>(null);
  const [modalType, setModalType] = useState<"rejected" | "hold" | null>(null);
  const navigate = useNavigate();

  const fetchApplications = async () => {
    try {
      const user = auth.currentUser;
      if (!user) {
        navigate("/login");
        return;
      }

      const token = await user.getIdToken();
      const res = await fetch("/.netlify/functions/fetchApplications", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const json = await res.json();
      if (!res.ok) {
        toast.error("불러오기 실패: " + (json.message || json.error));
        return;
      }

      setApplications(json);
    } catch (err) {
      toast.error("신청 데이터 로딩 실패");
    }
  };

  const updateStatus = async (id: string, status: string) => {
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
      toast.error("업데이트 실패: " + (json.message || json.error));
    }
  };

  const extractSymbolFromChartUrl = (url: string): string | null => {
    try {
      const parsed = new URL(url);
      const rawSymbol = parsed.searchParams.get("symbol");
      return rawSymbol ? decodeURIComponent(rawSymbol) : null;
    } catch {
      return null;
    }
  };

  const handleApprove = (app: Application) => {
    const symbol = extractSymbolFromChartUrl(app.chart_url);
    if (!symbol) {
      toast.error("❌ TradingView 심볼을 추출할 수 없습니다.");
      return;
    }

    navigate(
      `/nimda/project-register?slug=${app.slug}&name_ko=${encodeURIComponent(
        app.name_ko
      )}&symbol=${encodeURIComponent(symbol)}`
    );
  };

  const renderButtons = (app: Application) => {
    const showModal = (type: "rejected" | "hold") => {
      setModalAppId(app.id);
      setModalType(type);
    };

    switch (app.status) {
      case "registered":
        return (
          <button className="bg-gray-600 text-white px-2 py-1 rounded" disabled>
            승인완료
          </button>
        );
      case "rejected":
        return (
          <button
            className="bg-red-400 text-white px-2 py-1 rounded"
            onClick={() => showModal("rejected")}
          >
            승인거절
          </button>
        );
        case "hold":
          return (
            <button
              className="bg-yellow-400 text-black px-2 py-1 rounded"
              onClick={() => showModal("hold")}
            >
              보류됨
            </button>
          );
      case "pending":
      default:
        return (
          <div className="flex flex-col gap-1">
            <button
              className="bg-green-400 text-black px-2 py-1 rounded"
              onClick={() => handleApprove(app)}
            >
              승인
            </button>
            <button
              className="bg-red-400 text-white px-2 py-1 rounded"
              onClick={() => updateStatus(app.id, "rejected")}
            >
              거절
            </button>
            <button
              className="bg-yellow-400 text-black px-2 py-1 rounded"
              onClick={() => updateStatus(app.id, "hold")}
            >
              보류
            </button>
          </div>
        );
    }
  };

  const renderModal = () => {
    if (!modalAppId || !modalType) return null;

    const handleClick = (nextStatus: string) => {
      updateStatus(modalAppId, nextStatus);
      setModalAppId(null);
      setModalType(null);
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
        <div className="bg-white text-black p-6 rounded shadow-lg w-[300px] text-center">
          <p className="mb-4 font-semibold">
            {modalType === "rejected"
              ? "거절된 신청입니다. 처리 선택:"
              : "보류된 신청입니다. 처리 선택:"}
          </p>
          <div className="flex justify-center gap-2">
            {modalType === "rejected" && (
              <button
                className="bg-yellow-400 px-3 py-1 rounded"
                onClick={() => handleClick("hold")}
              >
                보류처리
              </button>
            )}
            <button
              className="bg-green-400 px-3 py-1 rounded"
              onClick={() => {
                const app = applications.find((a) => a.id === modalAppId);
                if (app) handleApprove(app);
              }}
            >
              승인처리
            </button>
            <button
              className="bg-gray-500 text-white px-3 py-1 rounded"
              onClick={() => {
                setModalAppId(null);
                setModalType(null);
              }}
            >
              닫기
            </button>
          </div>
        </div>
      </div>
    );
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  return (
    <div className="bg-[#000] text-white p-6">
      <h2 className="text-2xl font-bold mb-4">📁 프로젝트 접수 현황</h2>
      <p className="text-green-400 mb-4">
        🟦 현재까지 접수된 프로젝트: {applications.length}
      </p>

      <div className="overflow-x-auto">
        <table className="w-full text-sm border border-gray-700">
          <thead className="bg-gray-900 text-left">
            <tr>
              <th className="p-2">이름</th>
              <th className="p-2">slug</th>
              <th className="p-2">이메일</th>
              <th className="p-2">제출시각</th>
              <th className="p-2">액션</th>
            </tr>
          </thead>
          <tbody>
            {applications.map((app) => (
              <React.Fragment key={app.id}>
                <tr
                  className="border-t border-gray-700 hover:bg-gray-800 cursor-pointer"
                  onClick={() =>
                    setExpandedRows((prev) =>
                      prev.includes(app.id)
                        ? prev.filter((x) => x !== app.id)
                        : [...prev, app.id]
                    )
                  }
                >
                  <td className="p-2 font-bold">
                    {app.name} ({app.name_ko})
                  </td>
                  <td className="p-2">{app.slug}</td>
                  <td className="p-2">{app.email}</td>
                  <td className="p-2">
                    {new Date(app.submitted_at).toLocaleString("ko-KR")}
                  </td>
                  <td className="p-2">{renderButtons(app)}</td>
                </tr>
                {expandedRows.includes(app.id) && (
                  <tr className="bg-gray-900">
                    <td colSpan={5} className="p-4">
                      <p className="mb-2">
                        📃 설명: {app.description || "설명 없음"}
                      </p>
                      <p className="mb-2">
                        📈 Chart URL:{" "}
                        <a
                          href={app.chart_url}
                          target="_blank"
                          className="underline text-blue-400"
                          rel="noreferrer"
                        >
                          {app.chart_url || "없음"}
                        </a>
                      </p>
                      <p className="mb-2">
                        📄 Whitepaper:{" "}
                        <a
                          href={app.whitepaper}
                          target="_blank"
                          className="underline text-blue-400"
                          rel="noreferrer"
                        >
                          {app.whitepaper || "없음"}
                        </a>
                      </p>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
      {renderModal()}
    </div>
  );
};

export default ProjectApplications;
