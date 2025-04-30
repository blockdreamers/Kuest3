// src/components/nimda/NimdaSidebar.tsx
import React from 'react';

interface NimdaSidebarProps {
  activePage: string;
  setActivePage: (page: string) => void;
}

const NimdaSidebar = ({ activePage, setActivePage }: NimdaSidebarProps) => {
  return (
    <div className="w-64 bg-[#121212] text-white min-h-screen p-6">
      <h2 className="text-2xl font-bold mb-8">NIMDA</h2>
      <nav className="flex flex-col space-y-4">
        <button
          onClick={() => setActivePage('dashboard')}
          className={`text-left p-2 rounded-lg transition-colors duration-200 ${
            activePage === 'dashboard' ? 'bg-[#C7EB3E] text-black font-bold' : 'hover:bg-gray-700'
          }`}
        >
          대시보드
        </button>

        <button
          onClick={() => setActivePage('users')}
          className={`text-left p-2 rounded-lg transition-colors duration-200 ${
            activePage === 'users' ? 'bg-[#C7EB3E] text-black font-bold' : 'hover:bg-gray-700'
          }`}
        >
          유저 관리
        </button>

        {/* 프로젝트 관리 섹션 */}
        <div>
          <button
            onClick={() => setActivePage('projects')}
            className={`text-left w-full p-2 rounded-lg transition-colors duration-200 ${
              activePage === 'projects' ? 'bg-[#C7EB3E] text-black font-bold' : 'hover:bg-gray-700'
            }`}
          >
            프로젝트 현황
          </button>
          <button
            onClick={() => setActivePage('projects-register')}
            className={`ml-4 text-left w-[calc(100%-1rem)] p-2 rounded-lg text-sm transition-colors duration-200 ${
              activePage === 'projects-register'
                ? 'bg-[#C7EB3E] text-black font-bold'
                : 'hover:bg-gray-700'
            }`}
          >
            ▸ 프로젝트 등록
          </button>
        </div>
      </nav>
    </div>
  );
};

export default NimdaSidebar;
