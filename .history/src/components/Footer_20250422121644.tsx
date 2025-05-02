import React from 'react';
import { Link } from 'react-router-dom';
import { Send, Twitter, Mail } from 'lucide-react';
import './Footer.css'; // 커스텀 스타일

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t font-['Montserrat','Pretendard',sans-serif]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10">

          {/* ✅ 로고 & 슬로건 */}
          <div>
            <img
              src="https://github.com/blockdreamers/Kuest3/blob/main/ChatGPT%20Image%20Apr%209%2C%202025%2C%2004_44_33%20PM%202.png?raw=true"
              alt="Kuest3 Logo"
              className="w-[120px] mb-2"
            />
            <p className="text-sm font-semibold text-black">퀘스트하고 에어드랍 받기!</p>
          </div>

          {/* 서비스 */}
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

          {/* 회사 */}
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

          {/* 법적 고지 */}
          <div>
            <h3 className="footer-heading">법적 고지</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/terms" className="footer-link">이용약관</Link>
              </li>
              <li>
                <Link to="/privacy" className="footer-link">개인정보처리방침</Link>
              </li>
            </ul>
          </div>

          {/* 소셜 미디어 */}
          <div className="flex space-x-4 md:justify-end">
            <a
              href="https://twitter.com/kuest3"
              target="_blank"
              rel="noopener noreferrer"
              className="footer-icon"
            >
              <Twitter />
            </a>
            <a href="mailto:contact@kuest3.com" className="footer-icon">
              <Mail />
            </a>
            <a
              href="https://t.me/kuest3"
              target="_blank"
              rel="noopener noreferrer"
              className="footer-icon"
            >
              <Send />
            </a>
          </div>
        </div>

        <div className="mt-10 text-center text-sm text-gray-400">
          &copy; {currentYear} Kuest3. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
