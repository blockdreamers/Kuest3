// src/pages/Nimda.tsx
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import NimdaSidebar from '@/components/nimda/NimdaSidebar';
import NimdaDashboard from '@/components/nimda/NimdaDashboard';
import NimdaUserManagement from '@/components/nimda/NimdaUserManagement';

const Nimda = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activePage, setActivePage] = useState<string>('dashboard');

  useEffect(() => {
    if (!user) {
      navigate('/login');
    } else {
      if (user.user_type !== 'admin') {
        navigate('/');
      }
    }
  }, [user, navigate]);

  return (
    <div className="flex min-h-screen bg-gray-100">
      <NimdaSidebar activePage={activePage} setActivePage={setActivePage} />
      <div className="flex-1 p-8">
        {activePage === 'dashboard' && <NimdaDashboard />}
        {activePage === 'users' && <NimdaUserManagement />}
      </div>
    </div>
  );
};

export default Nimda;
