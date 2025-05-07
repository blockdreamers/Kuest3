// ProjectApplications.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { auth } from '@/config/firebase';
import styles from './ProjectApplications.module.css';

interface Application {
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
}

const ProjectApplications = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const navigate = useNavigate();

  const fetchApplications = async () => {
    try {
      const user = auth.currentUser;
      if (!user) {
        navigate('/login');
        return;
      }
      const token = await user.getIdToken();
      const res = await fetch('/.netlify/functions/fetchApplications', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const json = await res.json();
      if (!res.ok || !Array.isArray(json)) {
        toast.error('프로젝트 불러오기 실패');
        return;
      }
      setApplications(json);
    } catch (err: any) {
      toast.error('불러오기 오류: ' + err.message);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const formatDate = (ts: string) => {
    return new Date(ts).toLocaleString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="bg-[#121212] text-white rounded-xl p-6">
      <h2 className="text-2xl font-bold mb-6">📂 프로젝트 접수 현황</h2>
      <p className="text-green-400 font-mono mb-4">📊 현재 applications.length: {applications.length}</p>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-gray-400 text-left">
              <th className="p-2">이름</th>
              <th className="p-2">Slug</th>
              <th className="p-2">이메일</th>
              <th className="p-2">설명</th>
              <th className="p-2">제출시각</th>
              <th className="p-2">액션</th>
            </tr>
          </thead>
          <tbody>
            {applications.map((app) => (
              <React.Fragment key={app.id}>
                <tr className="border-t border-gray-700 hover:bg-[#1e1e1e] cursor-pointer">
                  <td className="p-2 font-bold">{app.name} <span className="text-gray-400">({app.name_ko})</span></td>
                  <td className="p-2">{app.slug}</td>
                  <td className="p-2">{app.email}</td>
                  <td
                    className="p-2 text-blue-400 underline"
                    onClick={() => setExpandedId(expandedId === app.id ? null : app.id)}
                  >
                    {expandedId === app.id ? '간략히' : '자세히'} 보기
                  </td>
                  <td className="p-2">{formatDate(app.submitted_at)}</td>
                  <td className="p-2 space-x-2">
                    <button className="bg-emerald-400 text-black px-2 py-1 rounded hover:opacity-90">등록하기</button>
                    <button className="bg-yellow-300 text-black px-2 py-1 rounded hover:opacity-90">
                      {app.status === 'pending' ? '승인불가' : '대기중'}
                    </button>
                  </td>
                </tr>
                {expandedId === app.id && (
                  <tr className="bg-[#1e1e1e] text-white">
                    <td colSpan={6} className="p-4">
                      <p className="mb-2 whitespace-pre-wrap text-sm leading-relaxed">📝 {app.description}</p>
                      <p>📈 <a className="text-blue-400" href={app.chart_url} target="_blank" rel="noreferrer">{app.chart_url || '없음'}</a></p>
                      <p>📃 <a className="text-blue-400" href={app.whitepaper} target="_blank" rel="noreferrer">{app.whitepaper || '없음'}</a></p>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProjectApplications;
