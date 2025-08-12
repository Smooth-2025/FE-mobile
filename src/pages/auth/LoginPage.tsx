import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from '@emotion/styled';
import { theme } from '@styles/theme';
import { useAppDispatch, useAppSelector } from '@hooks/useAppRedux';
import { Input } from '@components/common';
import { useToast } from '@/hooks/useToast';
import AlertToast from '@components/common/AlertToast/AlertToast';
import {
  loginAsync,
  clearError,
  selectIsAuthenticated,
  selectIsLoginLoading,
  selectAuthError,
  selectUser
} from '@store/slices/authSlice';
import type { LoginRequest } from '@/types/api';

// 스타일드 컴포넌트들
const PageContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f8f9fa;
  padding: 20px;
`;

const LoginContainer = styled.div`
  width: 100%;
  max-width: 400px;
  background: white;
  border-radius: 24px;
  padding: 40px 32px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
`;

const BrandTitle = styled.h1`
  font-size: 32px;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0 0 40px 0;
  text-align: left;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 8px; // 기존 Input의 margin-bottom과 맞춤
`;

const PasswordWrapper = styled.div`
  position: relative;
`;

const PasswordToggleButton = styled.button`
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  color: ${theme.colors.neutral500};
  font-size: 14px;
  padding: 4px 8px;
  border-radius: 4px;
  transition: all 0.2s ease;

  &:hover {
    background-color: ${theme.colors.neutral100};
    color: ${theme.colors.neutral600};
  }

  &:focus {
    outline: none;
    background-color: ${theme.colors.neutral100};
  }
`;

const LoginButton = styled.button<{ isLoading: boolean }>`
  width: 100%;
  padding: 16px;
  background: ${props => props.isLoading ? '#93c5fd' : '#3b82f6'};
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: ${props => props.isLoading ? 'not-allowed' : 'pointer'};
  transition: all 0.2s ease;
  margin-top: 24px;

  &:hover {
    background: ${props => props.isLoading ? '#93c5fd' : '#2563eb'};
  }

  &:active {
    transform: ${props => props.isLoading ? 'none' : 'translateY(1px)'};
  }
`;

const ErrorMessage = styled.p`
  color: #ef4444;
  font-size: 12px;
  margin: 4px 0 0 0;
  line-height: 1.4;
`;

const SignupLink = styled.div`
  text-align: center;
  margin-top: 24px;
  color: #6b7280;
  font-size: 14px;
`;

const LinkButton = styled.button`
  background: none;
  border: none;
  color: #3b82f6;
  cursor: pointer;
  font-size: 14px;
  text-decoration: underline;
  
  &:hover {
    color: #2563eb;
  }
`;


// 폼 유효성 검사
interface FormErrors {
  email?: string;
  password?: string;
}

const validateForm = (email: string, password: string): FormErrors => {
  const errors: FormErrors = {};
  // 이메일 유효성 검사
  if (!email) {
    errors.email = '이메일을 입력해주세요.';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = '이메일을 다시 확인해주세요';
  }
  // 비밀번호 유효성 검사  
  if (!password) {
    errors.password = '비밀번호를 입력해주세요.';
  } else if (password.length < 8) {
    errors.password = '비밀번호 8~16자를 입력해주세요.';
  }

  return errors;
};


// LoginPage 컴포넌트
export function LoginPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { toasts, showLoginError } = useToast();

  // Redux 상태
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const isLoginLoading = useAppSelector(selectIsLoginLoading);
  const error = useAppSelector(selectAuthError);
  const user = useAppSelector(selectUser);

  // 로컬 상태
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [touchedFields, setTouchedFields] = useState<Record<string, boolean>>({});
  const [showPassword, setShowPassword] = useState(false);

  // 부수 효과들
  // 이미 로그인된 경우 리다이렉트
  useEffect(() => {
    if (isAuthenticated && user) {
      console.warn(`${user.name}님, 환영합니다!`);
      navigate('/dashboard');
    }
  }, [isAuthenticated, user, navigate]);

  // Redux 에러를 토스트로 표시
  useEffect(() => {
    if (error) {
      showLoginError(error);
      dispatch(clearError());
    }
  }, [error, showLoginError, dispatch]);

  // 컴포넌트 언마운트시 에러 클리어
  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  // 이벤트 핸들러들

  // 입력값 변경
  const handleInputChange = (field: keyof typeof formData) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;
    setFormData(prev => ({ ...prev, [field]: value }));
   
    // 실시간 유효성 검사 (터치된 필드만)
    if (touchedFields[field]) {
      const errors = validateForm(
        field === 'email' ? value : formData.email,
        field === 'password' ? value : formData.password
      );
      setFormErrors(errors);
    }
  };

  // 필드 터치 표시
  const handleFieldBlur = (field: string) => () => {
    setTouchedFields(prev => ({ ...prev, [field]: true }));
    
    // 터치된 필드의 유효성 검사
    const errors = validateForm(formData.email, formData.password);
    setFormErrors(errors);
  };

  // 비밀번호 보기/숨기기 토글
  const togglePasswordVisibility = () => {
    setShowPassword(prev => !prev);
  };

  // 폼 제출
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 모든 필드를 터치된 것으로 표시
    setTouchedFields({ email: true, password: true });

    // 유효성 검사
    const errors = validateForm(formData.email, formData.password);
    setFormErrors(errors);

    if (Object.keys(errors).length > 0) {
      return;
    }

    // 로그인 시도
    try {
      const loginData: LoginRequest = {
        email: formData.email,
        password: formData.password
      };
      await dispatch(loginAsync(loginData)).unwrap();
      // 성공시 useEffect에서 자동 리다이렉트
    } catch (error) {
      // 에러는 useEffect에서 토스트로 표시
      console.error('로그인 실패:', error);
    }
  };
  // 렌더링

  return (
    <>
      <PageContainer>
        <LoginContainer>
          {/* 브랜드명 */}
          <BrandTitle>smooth</BrandTitle>

          {/* 로그인 폼 */}
          <Form onSubmit={handleSubmit}>
            {/* 이메일 입력 */}
            <div>
              <Input
                type="email"
                label="이메일"
                placeholder="이메일을 입력해주세요"
                value={formData.email}
                onChange={handleInputChange('email')}
                onBlur={handleFieldBlur('email')}
                disabled={isLoginLoading}
                required
                style={{
                  borderColor: touchedFields.email && formErrors.email ? '#ef4444' : 
                              touchedFields.email && !formErrors.email && formData.email ? '#22c55e' : 
                              undefined
                }}
              />
              {touchedFields.email && formErrors.email && (
                <ErrorMessage>{formErrors.email}</ErrorMessage>
              )}
            </div>

            {/* 비밀번호 입력 */}
            <div>
              <PasswordWrapper>
                <Input
                  type={showPassword ? 'text' : 'password'}
                  label="비밀번호"
                  placeholder="비밀번호를 입력해주세요"
                  value={formData.password}
                  onChange={handleInputChange('password')}
                  onBlur={handleFieldBlur('password')}
                  disabled={isLoginLoading}
                  required
                  style={{
                    borderColor: touchedFields.password && formErrors.password ? '#ef4444' : 
                                touchedFields.password && !formErrors.password && formData.password ? '#22c55e' : 
                                undefined,
                    paddingRight: '60px' // 버튼 공간 확보
                  }}
                />
                <PasswordToggleButton
                  type="button"
                  onClick={togglePasswordVisibility}
                  disabled={isLoginLoading}
                  aria-label={showPassword ? '비밀번호 숨기기' : '비밀번호 보기'}
                >
                  {showPassword ? '숨기기' : '보기'}
                </PasswordToggleButton>
              </PasswordWrapper>
              {touchedFields.password && formErrors.password && (
                <ErrorMessage>{formErrors.password}</ErrorMessage>
              )}
            </div>

            {/* 로그인 버튼 */}
            <LoginButton 
              type="submit" 
              isLoading={isLoginLoading}
              disabled={isLoginLoading}
            >
              {isLoginLoading ? '로그인 중...' : '로그인'}
            </LoginButton>
          </Form>

          {/* 회원가입 링크 */}
          <SignupLink>
            이메일로 가입하기{' '}
            <LinkButton 
              type="button"
              onClick={() => navigate('/register')}
              disabled={isLoginLoading}
            >
              이메일로 가입하기
            </LinkButton>
          </SignupLink>
        </LoginContainer>
      </PageContainer>

      {/* 토스트 알림들 */}
      {toasts.map(toast => (
        <AlertToast
          key={toast.id}
          type={toast.type}
          title={toast.title}
          content={toast.content}
          position={toast.position}
          duration={toast.duration}
        />
      ))}
    </>
  );
}