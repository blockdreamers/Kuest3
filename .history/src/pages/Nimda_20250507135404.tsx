import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import NimdaSidebar from '@/components/nimda/NimdaSidebar';
import NimdaDashboard from '@/components/nimda/NimdaDashboard';
import NimdaUserManagement from '@/components/nimda/NimdaUserManagement';
import ProjectOverview from '@/components/nimda/ProjectOverview';
import ProjectRegister from '@/components/nimda/ProjectRegister';
import ProjectApplications from '@/components/nimda/ProjectApplications';

const Nimda = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [activePage, setActivePage] = useState<string>('dashboard');

  const queryParams = new URLSearchParams(location.search);
  const slug = queryParams.get('slug');
  const nameKo = queryParams.get('name_ko');
  const symbol = queryParams.get('symbol');

  // ✅ 권한 검사 및 쿼리 파라미터에 따라 등록 페이지 설정
  useEffect(() => {
    if (!user) {
      navigate('/login');
    } else if (user.user_type !== 'admin') {
      navigate('/');
    } else if (slug || nameKo || symbol) {
      setActivePage('projects-register');
    }
  }, [user, navigate, slug, nameKo, symbol]);

  // ✅ 페이지 변경 핸들러 (navigate 포함)
  const handlePageChange = (page: string) => {
    setActivePage(page);
    switch (page) {
      case 'dashboard':
        navigate('/nimda');
        break;
      case 'users':
        navigate('/nimda/users');
        break;
      case 'projects':
        navigate('/nimda/project-overview');
        break;
      case 'projects-register':
        navigate('/nimda/project-register');
        break;
      case 'projects-applications':
        navigate('/nimda/project-applications');
        break;
      default:
        break;
    }
  };

  return (
    <div className="flex min-h-screen bg-[#000000] text-white">
      {/* 사이드바 */}
      <NimdaSidebar activePage={activePage} setActivePage={handlePageChange} />

      {/* 콘텐츠 영역 */}
      <main className="flex-1 p-6 overflow-y-auto">
        {activePage === 'dashboard' && <NimdaDashboard />}
        {activePage === 'users' && <NimdaUserManagement />}
        {activePage === 'projects' && <ProjectOverview />}
        {activePage === 'projects-register' && (
          <ProjectRegister
            prefill={{
              slug: slug || '',
              nameKo: nameKo || '',
              tvSymbol: symbol || '',
            }}
          />
        )}
        {activePage === 'projects-applications' && <ProjectApplications />}
      </main>
    </div>
  );
};

export default Nimda;
