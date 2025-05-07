import React from 'react';
import { Send, Twitter, Mail } from 'lucide-react';
import './Footer.css'; // ✨ 커스텀 스타일

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer-wrapper border-t bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 md:grid-cols-5 gap-10 items-start font-['Montserrat','Pretendard',sans-serif]">

        {/* 로고 영역 */}
        <div>
          <div className="flex items-center space-x-1 mb-2">
            <h1 className="text-2xl font-bold text-black">Quest</h1>
            <span className="text-xl font-bold bg-lime-300 text-black px-2 rounded -rotate-6">N</span>
          </div>
          <p className="text-sm text-black font-semibold">QuestN, AI for Airdrops!</p>
        </div>

        {/* Product */}
        <div>
          <h3 className="footer-heading">Product</h3>
          <ul className="space-y-3">
            <li><a href="#" className="footer-link">Start Earning</a></li>
            <li><a href="#" className="footer-link">Launch Airdrops</a></li>
            <li><a href="#" className="footer-link">Docs</a></li>
          </ul>
        </div>

        {/* Service */}
        <div>
          <h3 className="footer-heading">Service</h3>
          <ul className="space-y-3">
            <li><a href="#" className="footer-link">Promotion</a></li>
            <li><a href="#" className="footer-link">Premium</a></li>
            <li><a href="#" className="footer-link">Brand Kit</a></li>
          </ul>
        </div>

        {/* About */}
        <div>
          <h3 className="footer-heading">About</h3>
          <ul className="space-y-3">
            <li><a href="#" className="footer-link">Terms</a></li>
            <li><a href="#" className="footer-link">Privacy</a></li>
          </ul>
        </div>

        {/* SNS */}
        <div className="flex space-x-4 justify-end md:justify-start">
          <a href="https://twitter.com/kuest3" target="_blank" rel="noopener noreferrer" className="footer-icon">
            <Twitter />
          </a>
          <a href="mailto:contact@kuest3.com" className="footer-icon">
            <Mail />
          </a>
          <a href="https://t.me/kuest3" target="_blank" rel="noopener noreferrer" className="footer-icon">
            <Send />
          </a>
        </div>
      </div>

      <div className="mt-10 text-center text-gray-400 text-sm">
        &copy; {currentYear} Kuest3. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
