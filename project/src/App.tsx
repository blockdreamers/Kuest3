import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import CoinDetail from './pages/CoinDetail';
import Login from './pages/Login';
import Profile from './pages/Profile';
import QuestDetail from './pages/QuestDetail';
import KOL from './pages/KOL';
import ListingApplication from './pages/ListingApplication';
import { useAuth } from './contexts/AuthContext';

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
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/coin/:id" element={<CoinDetail />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/quest/:id" element={<QuestDetail />} />
        <Route path="/kol" element={<KOL />} />
        <Route path="/listing" element={<ListingApplication />} />
      </Routes>
    </div>
  );
}

export default App;