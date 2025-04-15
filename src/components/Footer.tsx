import React from 'react';
import { Link } from 'react-router-dom';
import { Send, Twitter, Mail } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Service Links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase mb-4">
              서비스
            </h3>
            <ul className="space-y-3">
              <li>
                <Link to="/login" className="text-base text-gray-600 hover:text-gray-900">
                  회원가입
                </Link>
              </li>
              <li>
                <Link to="/quest/1" className="text-base text-gray-600 hover:text-gray-900">
                  퀘스트 수행하기
                </Link>
              </li>
              <li>
                <Link to="/points" className="text-base text-gray-600 hover:text-gray-900">
                  포인트 모으기
                </Link>
              </li>
              <li>
                <Link to="/listing" className="text-base text-gray-600 hover:text-gray-900">
                  리스팅 신청하기
                </Link>
              </li>
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase mb-4">
              회사
            </h3>
            <ul className="space-y-3">
              <li>
                <Link to="/about" className="text-base text-gray-600 hover:text-gray-900">
                  회사 소개
                </Link>
              </li>
              <li>
                <Link to="/business" className="text-base text-gray-600 hover:text-gray-900">
                  사업 제안
                </Link>
              </li>
              <li>
                <a
                  href="mailto:contact@kuest3.com"
                  className="text-base text-gray-600 hover:text-gray-900"
                >
                  제휴 문의
                </a>
              </li>
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase mb-4">
              법적 고지
            </h3>
            <ul className="space-y-3">
              <li>
                <Link to="/terms" className="text-base text-gray-600 hover:text-gray-900">
                  이용약관
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-base text-gray-600 hover:text-gray-900">
                  개인정보처리방침
                </Link>
              </li>
            </ul>
          </div>

          {/* Social Links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase mb-4">
              소셜 미디어
            </h3>
            <div className="flex space-x-6">
              <a
                href="https://t.me/kuest3"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-gray-500"
              >
                <span className="sr-only">Telegram</span>
                <Send className="h-6 w-6" />
              </a>
              <a
                href="https://twitter.com/kuest3"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-gray-500"
              >
                <span className="sr-only">Twitter</span>
                <Twitter className="h-6 w-6" />
              </a>
              <a
                href="mailto:contact@kuest3.com"
                className="text-gray-400 hover:text-gray-500"
              >
                <span className="sr-only">Email</span>
                <Mail className="h-6 w-6" />
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-8 border-t border-gray-200">
          <p className="text-base text-gray-400 text-center">
            &copy; {currentYear} Kuest3. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;