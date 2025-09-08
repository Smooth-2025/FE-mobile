import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@hooks/useAppRedux';
import { theme } from '@styles/theme';
import { Icon } from '@components/common/Icons';
import { Input } from '@components/common';
import AlertToast from '@components/common/AlertToast/AlertToast';
import {
  loginAsync,
  clearError,
  selectIsAuthenticated,
  selectIsLoginLoading,
  selectAuthError,
  selectUser,
} from '@store/slices/authSlice';
import { useToast } from '@/hooks/useToast';
import {
  PageContainer,
  LoginContainer,
  BrandTitle,
  Form,
  PasswordWrapper,
  PasswordToggleButton,
  LoginButton,
  ErrorMessage,
  SignupLink,
  LinkButton,
} from '@/components/auth/LoginPage.styles';
import { validateLoginForm, type LoginFormErrors } from '@/utils/validation/authValidation';
import type { LoginRequest } from '@/types/api';

// LoginPage 컴포넌트
export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const { toasts, showLoginError, showSuccess } = useToast();

  // Redux 상태
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const isLoginLoading = useAppSelector(selectIsLoginLoading);
  const error = useAppSelector(selectAuthError);
  const user = useAppSelector(selectUser);

  // 로컬 상태
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [formErrors, setFormErrors] = useState<LoginFormErrors>({});
  const [touchedFields, setTouchedFields] = useState<Record<string, boolean>>({});
  const [showPassword, setShowPassword] = useState(false);

  // 부수 효과들
  // 이미 로그인된 경우 리다이렉트
  useEffect(() => {
    if (isAuthenticated && user) {
      navigate('/');
    }
  }, [isAuthenticated, user, navigate]);

  // Redux 에러를 토스트로 표시
  useEffect(() => {
    if (error) {
      showLoginError(error);
      dispatch(clearError());
    }
  }, [error, showLoginError, dispatch]);

  // 성공 메시지 토스트 표시
  useEffect(() => {
    const state = location.state as { successMessage?: string } | null;
    if (state?.successMessage) {
      showSuccess(state.successMessage);
      // state를 정리하여 새로고침 시 중복 표시 방지
      window.history.replaceState({}, document.title);
    }
  }, [location.state, showSuccess]);

  // 컴포넌트 언마운트시 에러 클리어
  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  // 이벤트 핸들러들

  // 입력값 변경
  const handleInputChange =
    (field: keyof typeof formData) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setFormData((prev) => ({ ...prev, [field]: value }));

      // 실시간 유효성 검사 (터치된 필드만)
      if (touchedFields[field]) {
        const errors = validateLoginForm(
          field === 'email' ? value : formData.email,
          field === 'password' ? value : formData.password,
        );
        setFormErrors(errors);
      }
    };

  // 필드 터치 표시
  const handleFieldBlur = (field: string) => () => {
    setTouchedFields((prev) => ({ ...prev, [field]: true }));

    // 터치된 필드의 유효성 검사
    const errors = validateLoginForm(formData.email, formData.password);
    setFormErrors(errors);
  };

  // 비밀번호 보기/숨기기 토글
  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  // 폼 제출
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 모든 필드를 터치된 것으로 표시
    setTouchedFields({ email: true, password: true });

    // 유효성 검사
    const errors = validateLoginForm(formData.email, formData.password);
    setFormErrors(errors);

    if (Object.keys(errors).length > 0) {
      return;
    }

    // 로그인 시도
    try {
      const loginData: LoginRequest = {
        email: formData.email,
        password: formData.password,
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
                  style={{ paddingRight: '60px' }}
                />
                <PasswordToggleButton
                  type="button"
                  onClick={togglePasswordVisibility}
                  disabled={isLoginLoading}
                  aria-label={showPassword ? '비밀번호 숨기기' : '비밀번호 보기'}
                >
                  <Icon
                    name={showPassword ? 'eyeOpen' : 'eyeClosed'}
                    size={20}
                    color={theme.colors.neutral500}
                  />
                </PasswordToggleButton>
              </PasswordWrapper>
              {touchedFields.password && formErrors.password && (
                <ErrorMessage>{formErrors.password}</ErrorMessage>
              )}
            </div>

            {/* 로그인 버튼 */}
            <LoginButton type="submit" isLoading={isLoginLoading} disabled={isLoginLoading}>
              {isLoginLoading ? '로그인 중...' : '로그인'}
            </LoginButton>
          </Form>

          {/* 회원가입 링크 */}
          <SignupLink>
            <LinkButton
              type="button"
              onClick={() => navigate('/signup/email')}
              disabled={isLoginLoading}
            >
              이메일로 가입하기
            </LinkButton>
          </SignupLink>
        </LoginContainer>
      </PageContainer>

      {/* 토스트 알림들 */}
      {toasts.map((toast) => (
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
export { LoginPage as default };
