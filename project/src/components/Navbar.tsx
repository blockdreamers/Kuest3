import React from 'react';
import { Link } from 'react-router-dom';
import { usePrivy } from '@privy-io/react-auth';
import { User } from 'lucide-react';

const Navbar = () => {
  const { authenticated, user, logout } = usePrivy();

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link to="/" className="flex items-center">
              <img src="/kuest3-logo.png" alt="Kuest3" className="h-8" />
            </Link>
            
            <div className="hidden md:flex items-center space-x-6">
              <Link to="/kol" className="text-gray-900 hover:text-blue-600 transition-colors duration-200">
                League of KOLs
              </Link>
              <Link to="/listing" className="text-gray-900 hover:text-blue-600 transition-colors duration-200">
                Listing Application
              </Link>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {authenticated ? (
              <div className="flex items-center space-x-3">
                <Link to="/profile" className="flex items-center space-x-2">
                  {user?.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.email || user?.wallet?.address}
                      className="h-8 w-8 rounded-full ring-2 ring-blue-600"
                    />
                  ) : (
                    <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center">
                      <User className="h-5 w-5 text-white" />
                    </div>
                  )}
                  <span className="text-sm font-medium text-gray-900">
                    {user?.email || `${user?.wallet?.address?.slice(0, 6)}...${user?.wallet?.address?.slice(-4)}`}
                  </span>
                </Link>
                <button
                  onClick={() => logout()}
                  className="text-sm text-gray-600 hover:text-blue-600 transition-colors duration-200"
                >
                  로그아웃
                </button>
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
}

export default Navbar;