// src/pages/nimda/NimdaLayout.tsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import NimdaSidebar from '@/components/nimda/NimdaSidebar';

const NimdaLayout = () => {
  return (
    <div className="flex min-h-screen bg-black text-white">
      <NimdaSidebar />
      <main className="flex-1 p-6 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default NimdaLayout;
