import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import CoinDetail from './pages/CoinDetail';
import Login from './pages/Login';
import Profile from './pages/Profile';
import QuestDetail from './pages/QuestDetail';
import KOL from './pages/KOL';
import ListingApplication from './pages/ListingApplication';

function App() {
  return (
    <Router>
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
    </Router>
  );
}

export default App;