// src/pages/Nimda.tsx
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import NimdaSidebar from '@/components/nimda/NimdaSidebar';
import NimdaDashboard from '@/components/nimda/NimdaDashboard';
import NimdaUserManagement from '@/components/nimda/NimdaUserManagement';
import ProjectOverview from '@/components/nimda/ProjectOverview';
import ProjectRegister from '@/components/nimda/ProjectRegister';
import ProjectApplications from '@/components/nimda/ProjectApplications';



const Nimda = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activePage, setActivePage] = useState<string>('dashboard');

  useEffect(() => {
    if (!user) {
      navigate('/login');
    } else if (user.user_type !== 'admin') {
      navigate('/');
    }
  }, [user, navigate]);

  return (
    <div className="flex min-h-screen bg-[#000000] text-white">
      {/* 사이드바 */}
      <NimdaSidebar activePage={activePage} setActivePage={setActivePage} />

      {/* 콘텐츠 영역 */}
      <main className="flex-1 p-6 overflow-y-auto">
        {activePage === 'dashboard' && <NimdaDashboard />}
        {activePage === 'users' && <NimdaUserManagement />}
        {activePage === 'projects' && <ProjectOverview />}
        {activePage === 'projects-register' && <ProjectRegister />}
        {activePage === 'applications' && <ProjectApplications />}


      </main>
    </div>
  );
};

export default Nimda;
