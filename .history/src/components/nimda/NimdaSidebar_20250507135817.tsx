// src/components/nimda/NimdaSidebar.tsx
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const NimdaSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <aside className="w-64 bg-[#111] p-4 text-white">
      <h2 className="text-2xl font-bold mb-6">NIMDA</h2>
      <ul className="space-y-2">
        <li>
          <button
            className={`w-full text-left ${isActive('/nimda') ? 'text-lime-400 font-bold' : ''}`}
            onClick={() => navigate('/nimda')}
          >
            대시보드
          </button>
        </li>
        <li>
          <button
            className={`w-full text-left ${isActive('/nimda/users') ? 'text-lime-400 font-bold' : ''}`}
            onClick={() => navigate('/nimda/users')}
          >
            유저 관리
          </button>
        </li>
        <li className="mt-4 font-semibold">프로젝트 현황</li>
        <li className="ml-2">
          <button
            className={`w-full text-left ${isActive('/nimda/project-register') ? 'text-lime-400 font-bold' : ''}`}
            onClick={() => navigate('/nimda/project-register')}
          >
            ▸ 프로젝트 등록
          </button>
        </li>
        <li className="ml-2">
          <button
            className={`w-full text-left ${isActive('/nimda/project-applications') ? 'text-lime-400 font-bold' : ''}`}
            onClick={() => navigate('/nimda/project-applications')}
          >
            ▸ 프로젝트 접수 현황
          </button>
        </li>
      </ul>
    </aside>
  );
};

export default NimdaSidebar;
