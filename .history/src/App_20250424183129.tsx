import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import CoinDetail from './pages/CoinDetail';
import Login from './pages/Login';
import Profile from './pages/Profile';
import QuestDetail from './pages/QuestDetail';
import KOL from './pages/KOL';
import ListingApplication from './pages/ListingApplication';
import Points from './pages/Points';
import TelegramFeed from './pages/TelegramFeed';
import SocialAccounts from './pages/SocialAccounts';
import Airdrop from './pages/Airdrop'; // ✅ 추가한 부분
import { useAuth } from './contexts/AuthContext';
import TelegramFeedDetail from "./pages/TelegramFeedDetail";
import UserAgreements from './pages/UserAgreements';
import PrivacyPolicies from './pages/PrivacyPolicies';


function App() {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/coin/:id" element={<CoinDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/quest/:id" element={<QuestDetail />} />
          <Route path="/kol" element={<KOL />} />
          <Route path="/listing" element={<ListingApplication />} />
          <Route path="/points" element={<Points />} />
          <Route path="/telegram" element={<TelegramFeed />} />
          <Route path="/social-accounts" element={<SocialAccounts />} />
          <Route path="/airdrop" element={<Airdrop />} /> {/* ✅ 에어드롭 경로 추가 */}
          <Route path="/telegram/:username" element={<TelegramFeedDetail />} />
          <Route path="/user-agreements" element={<UserAgreements />} />
          <Route path="/privacy-policies" element={<PrivacyPolicies />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
