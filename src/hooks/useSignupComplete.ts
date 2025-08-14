import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export const useSignupComplete = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // 이전 단계에서 전달된 데이터
  const email = location.state?.email;
  const name = location.state?.name;

  // 회원가입 완료 확인
  useEffect(() => {
    if (!email) {
      // 이메일 정보가 없으면 로그인 페이지로 리다이렉트
      navigate('/login');
      return;
    }
  }, [email, navigate]);

  // 로그인 페이지로 이동
  const handleConfirm = () => {
    navigate('/login');
  };

  return {
    email,
    name,
    handleConfirm,
  };
};