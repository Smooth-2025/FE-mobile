// 타입이 적용된 로그인 폼 컴포넌트
import { useState } from 'react';
import { loginUser } from '@apis/auth';
import type { LoginRequest, LoginResponse } from '@/types/api';
import type { AxiosError } from 'axios';


// 컴포넌트 Props 타입 정의
interface LoginFormProps {
  onSuccess: (userData: LoginResponse) => void; // 로그인 성공시 콜백
  onError: (errorMessage: string) => void;      // 로그인 실패시 콜백
  isLoading?: boolean;                          // 로딩 상태
}


// 폼 상태 타입 정의 
interface FormState {
  email: string;
  password: string;
}

// 초기값도 타입에 맞게
const initialFormState: FormState = {
  email: '',
  password: ''
};


// LoginForm 컴포넌트
export function LoginForm({ onSuccess, onError, isLoading = false }: LoginFormProps) {
  const [formData, setFormData] = useState<FormState>(initialFormState);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  
  // 입력값 변경 핸들러
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // 타입 안전성: name은 FormState의 키여야 함
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // 폼 제출 핸들러
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (isSubmitting || isLoading) return;

    // 기본 유효성 검사
    if (!formData.email || !formData.password) {
      onError('이메일과 비밀번호를 모두 입력해주세요.');
      return;
    }

    try {
      setIsSubmitting(true);

      // API 호출 - 타입이 자동으로 맞춰짐
      const loginData: LoginRequest = {
        email: formData.email,
        password: formData.password
      };

      // loginUser 함수의 반환 타입이 LoginResponse로 보장됨
      const result: LoginResponse = await loginUser(loginData);

      // result.의 자동완성
      console.warn('로그인 성공!', result.name, result.token);
      
      // 성공 콜백 호출
      onSuccess(result);
      
      // 폼 초기화
      setFormData(initialFormState);

    } catch (error: unknown) {
      console.error('로그인 실패:', error);
      
      // 에러 메시지 추출
      const axiosError = error as AxiosError<{message?: string}>;
      const errorMessage = axiosError.response?.data?.message || '로그인에 실패했습니다.';
      onError(errorMessage);
      
    } finally {
      setIsSubmitting(false);
    }
  };


  // 렌더링

  return (
    <form onSubmit={handleSubmit} className="login-form">
      <div className="form-group">
        <label htmlFor="email">이메일</label>
        <input
          type="email"
          id="email"
          name="email" //name이 FormState의 키와 매칭되어야 함
          value={formData.email}
          onChange={handleInputChange}
          disabled={isSubmitting || isLoading}
          required
          placeholder="이메일을 입력하세요"
        />
      </div>

      <div className="form-group">
        <label htmlFor="password">비밀번호</label>
        <input
          type="password"
          id="password"
          name="password" //name이 FormState의 키와 매칭되어야 함
          value={formData.password}
          onChange={handleInputChange}
          disabled={isSubmitting || isLoading}
          required
          placeholder="비밀번호를 입력하세요"
        />
      </div>

      <button 
        type="submit" 
        disabled={isSubmitting || isLoading}
        className="submit-button"
      >
        {isSubmitting ? '로그인 중...' : '로그인'}
      </button>
    </form>
  );
}

// 사용 예시 (부모 컴포넌트에서)
/*
// 부모 컴포넌트에서 이렇게 사용:

export function LoginPage() {
  const handleLoginSuccess = (userData: LoginResponse) => {
    console.log('로그인된 사용자:', userData.name);
    // 토큰 저장, 리다이렉트 등
  };

  const handleLoginError = (errorMessage: string) => {
    alert(errorMessage);
  };

  return (
    <div className="login-page">
      <h1>로그인</h1>
      <LoginForm 
        onSuccess={handleLoginSuccess}
        onError={handleLoginError}
      />
    </div>
  );
}
*/