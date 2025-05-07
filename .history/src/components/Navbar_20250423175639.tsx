import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { User, ChevronDown, Star, MessageCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
  const { user, signOut } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <nav className="bg-white border-b border-gray-200 font-['Montserrat','Pretendard',sans-serif]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* 왼쪽: 로고 + 메뉴 */}
          <div className="flex items-center space-x-8">
            <Link to="/" className="flex items-center">
              <img
                src="https://raw.githubusercontent.com/blockdreamers/Kuest3/dev/222.png"
                alt="Kuest3"
                className="h-12 w-auto object-contain"
                style={{ objectFit: 'contain', objectPosition: 'center' }}
              />
            </Link>

            {/* 메뉴: 좌측 정렬 */}
            <div className="hidden md:flex items-center space-x-3">
              <Link
                to="/telegram"
                className="text-sm text-gray-900 px-3 py-1 rounded-xl hover:bg-black hover:text-white transition-all duration-200 flex items-center"
              >
                <MessageCircle className="h-4 w-4 mr-1" />
                텔레그램 모아보기
              </Link>
              <Link
                to="/points"
                className="text-sm text-gray-900 px-3 py-1 rounded-xl hover:bg-black hover:text-white transition-all duration-200 flex items-center"
              >
                <Star className="h-4 w-4 mr-1" />
                포인트 모으기
              </Link>
              <Link
                to="/airdrop"
                className="text-sm text-gray-900 px-3 py-1 rounded-xl hover:bg-black hover:text-white transition-all duration-200"
              >
                에어드롭
              </Link>
            </div>
          </div>

          {/* 오른쪽: 로그인 or 프로필 */}
          <div className="flex items-center space-x-4">
            {user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center space-x-2 focus:outline-none"
                >
                  <div className="flex items-center space-x-2">
                    {user.photoURL ? (
                      <img
                        src={user.photoURL}
                        alt={user.email || ''}
                        className="h-8 w-8 rounded-full ring-2 ring-blue-600"
                      />
                    ) : (
                      <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center">
                        <User className="h-5 w-5 text-white" />
                      </div>
                    )}
                    <span className="text-sm font-medium text-gray-900">
                      {user.email?.split('@')[0] || 'User'}
                    </span>
                    <ChevronDown
                      className={`h-4 w-4 text-gray-500 transition-transform duration-200 ${
                        isDropdownOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </div>
                </button>

                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-50">
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      내 프로필
                    </Link>
                    <button
                      onClick={() => {
                        signOut();
                        setIsDropdownOpen(false);
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      로그아웃
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="inline-flex items-center px-4 py-2 rounded-xl text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition-all duration-200"
              >
                <User className="h-5 w-5 mr-2" />
                로그인
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
