import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Mail, LogIn, AlertCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

const Login = () => {
  const { user, signInWithGoogle } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const from = location.state?.from?.pathname || "/";

  useEffect(() => {
    if (user) {
      navigate(from, { replace: true });
    }
  }, [user, navigate, from]);

  const handleGoogleSignIn = async (isSignUp: boolean) => {
    if (isProcessing) return;
    setIsProcessing(true);
    setError(null);

    try {
      await signInWithGoogle(isSignUp);
    } catch (error: any) {
      console.error('Authentication failed:', error);
      if (error.code === 'auth/popup-blocked') {
        setError('팝업이 차단되었습니다. 팝업 차단을 해제하고 다시 시도해 주세요.');
        toast.error('팝업 차단을 해제해 주세요', { duration: 5000 });
      } else {
        setError(isSignUp 
          ? '회원가입 중 오류가 발생했습니다. 다시 시도해 주세요.' 
          : '로그인 중 오류가 발생했습니다. 다시 시도해 주세요.'
        );
        toast.error(isSignUp ? '회원가입 실패' : '로그인 실패', { duration: 3000 });
      }
    } finally {
      setIsProcessing(false);
    }
  };

  if (user) return null;

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center bg-gray-50 font-['Pretendard','Montserrat'] px-4">
      {/* 상단 로고 + 문구 */}
      <div className="text-center mb-10">
        <img
          src="https://github.com/blockdreamers/Kuest3/blob/dev/222.png?raw=true"
          alt="Kuest Logo"
          className="h-14 mx-auto mb-2"
        />
        <h1 className="text-xl font-bold text-black">퀘스트하고 에어드롭받자!</h1>
      </div>

      {/* 에러 메시지 */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center mb-6 max-w-md w-full">
          <AlertCircle className="h-5 w-5 mr-2" />
          <p className="text-sm">{error}</p>
        </div>
      )}

      {/* 회원가입 버튼 */}
      <div className="w-full max-w-md bg-black text-white rounded-xl shadow-lg p-3 mb-3 text-center">
        <button
          onClick={() => handleGoogleSignIn(true)}
          disabled={isProcessing}
          className={`w-full flex items-center justify-center px-4 py-2 rounded-lg text-sm font-semibold bg-black text-white hover:bg-[#C7EB3E] hover:text-black active:scale-[0.97] transition-all duration-200 ${
            isProcessing ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          <Mail className="mr-2 h-5 w-5" />
          {isProcessing ? '처리 중...' : 'Google 이메일로 회원가입'}
        </button>
      </div>

      {/* 로그인 버튼 */}
      <div className="w-full max-w-md bg-black text-white rounded-xl shadow-lg p-3 text-center">
        <button
          onClick={() => handleGoogleSignIn(false)}
          disabled={isProcessing}
          className={`w-full flex items-center justify-center px-4 py-2 rounded-lg text-sm font-semibold bg-black text-white hover:bg-[#C7EB3E] hover:text-black active:scale-[0.97] transition-all duration-200 ${
            isProcessing ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          <LogIn className="mr-2 h-5 w-5" />
          {isProcessing ? '처리 중...' : 'Google 이메일로 로그인'}
        </button>
      </div>
    </div>
  );
};

export default Login;
