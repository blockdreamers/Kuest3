import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, LogIn, AlertCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Login = () => {
  const { user, signInWithGoogle } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      navigate('/profile');
    }
  }, [user, navigate]);

  const handleGoogleSignIn = (isSignUp: boolean) => {
    setError(null);
    signInWithGoogle()
      .catch((error: any) => {
        console.error('Authentication failed:', error);
        setError(isSignUp 
          ? '회원가입 중 오류가 발생했습니다. 다시 시도해 주세요.' 
          : '로그인 중 오류가 발생했습니다. 다시 시도해 주세요.'
        );
      });
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            시작하기
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            계정을 만들거나 로그인하세요
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center">
            <AlertCircle className="h-5 w-5 mr-2" />
            <p className="text-sm">{error}</p>
          </div>
        )}

        <div className="space-y-4">
          <button
            onClick={() => handleGoogleSignIn(true)}
            className="w-full flex items-center justify-center px-4 py-3 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Mail className="mr-2 h-5 w-5" />
            Google 이메일로 회원가입
          </button>

          <button
            onClick={() => handleGoogleSignIn(false)}
            className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <LogIn className="mr-2 h-5 w-5" />
            Google 이메일로 로그인
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;