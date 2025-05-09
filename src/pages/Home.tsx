import React from 'react';
import CryptoProjects from '../components/CryptoProjects';
import VotingStatus from '../components/VotingStatus';
import OngoingQuests from '../components/OngoingQuests';
import RollingBanner from '../components/RollingBanner';

const Home = () => {
  return (
    <div className="bg-[#0F0F0F] min-h-screen">
      <RollingBanner />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 순서 변경됨 */}
        <VotingStatus />
        <CryptoProjects />
        <OngoingQuests />
      </div>
    </div>
  );
};

export default Home;
