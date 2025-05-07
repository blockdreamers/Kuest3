import React from 'react';
import { Link } from 'react-router-dom';
import { Send, Twitter, Mail } from 'lucide-react';
import './Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer-wrapper border-t bg-white font-['Montserrat','Pretendard',sans-serif]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 md:grid-cols-5 gap-10 items-start">
        
        {/* ✅ 로고 */}
        <div>
          <div className="flex items-center space-x-2 mb-2">
            <img
              src="https://raw.githubusercontent.com/blockdreamers/Kuest3/main/ChatGPT%20Image%20Apr%209%2C%202025%2C%2004_44_33%20PM%202.png"
              alt="Kuest Logo"
              className="w-28 h-auto object-contain"
            />
          </div>
          <p className="text-sm text-black font-semibold">퀘스트하고 에어드랍 받자!</p>
        </div>

        {/* ✅ 서비스 */}
        <div>
          <h3 className="footer-heading">서비스</h3>
          <ul className="space-y-3">
            <li>
              <Link to="/login" className="footer-link">회원가입</Link>
            </li>
            <li>
              <Link to="/quest/1" className="footer-link">퀘스트 수행하기</Link>
            </li>
            <li>
              <Link to="/points" className="footer-link">포인트 모으기</Link>
            </li>
            <li>
              <Link to="/listing" className="footer-link">리스팅 신청하기</Link>
            </li>
          </ul>
        </div>

        {/* ✅ 회사 */}
        <div>
          <h3 className="footer-heading">회사</h3>
          <ul className="space-y-3">
            <li>
              <Link to="/about" className="footer-link">회사 소개</Link>
            </li>
            <li>
              <Link to="/business" className="footer-link">사업 제안</Link>
            </li>
            <li>
              <a href="mailto:contact@kuest3.com" className="footer-link">제휴 문의</a>
            </li>
          </ul>
        </div>

        {/* ✅ 법적 고지 */}
        <div>
          <h3 className="footer-heading">법적 고지</h3>
          <ul className="space-y-3">
            <li>
            <Link to="/user-agreements" className="hover:underline">이용약관</Link>
            </li>
            <li>
              <Link to="/privacy" className="footer-link">개인정보처리방침</Link>
            </li>
          </ul>
        </div>

        {/* ✅ SNS 아이콘 */}
        <div className="flex space-x-4 justify-end md:justify-start">
          <a href="https://twitter.com/kuest3" target="_blank" rel="noopener noreferrer" className="footer-icon">
            <Twitter className="w-5 h-5" />
          </a>
          <a href="mailto:contact@kuest3.com" className="footer-icon">
            <Mail className="w-5 h-5" />
          </a>
          <a href="https://t.me/kuest3" target="_blank" rel="noopener noreferrer" className="footer-icon">
            <Send className="w-5 h-5" />
          </a>
        </div>
      </div>

      {/* ✅ Copyright */}
      <div className="mt-10 text-center text-gray-400 text-sm">
        &copy; {currentYear} Kuest3. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
