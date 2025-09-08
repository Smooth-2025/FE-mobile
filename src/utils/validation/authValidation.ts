// 로그인 폼 에러 타입
export interface LoginFormErrors {
  email?: string;
  password?: string;
}

// 이메일 유효성 검사
export const validateEmail = (email: string): string => {
  if (!email) {
    return '이메일을 입력해주세요.';
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return '이메일을 다시 확인해주세요';
  }
  return '';
};

// 비밀번호 유효성 검사 (로그인용)
export const validateLoginPassword = (password: string): string => {
  if (!password) {
    return '비밀번호를 입력해주세요.';
  }
  if (password.length < 8) {
    return '비밀번호 8~16자를 입력해주세요.';
  }
  return '';
};

// 로그인 폼 전체 유효성 검사
export const validateLoginForm = (email: string, password: string): LoginFormErrors => {
  const errors: LoginFormErrors = {};

  const emailError = validateEmail(email);
  if (emailError) errors.email = emailError;

  const passwordError = validateLoginPassword(password);
  if (passwordError) errors.password = passwordError;

  return errors;
};

// 인증번호 유효성 검사
export const validateVerificationCode = (code: string): string => {
  if (!code) {
    return '인증번호를 입력해주세요.';
  }
  if (!/^\d{5}$/.test(code)) {
    return '인증번호는 5자리 숫자입니다.';
  }
  return '';
};

// 인증번호 입력값 포맷팅 (숫자만, 5자리 제한)
export const formatVerificationCode = (value: string): string => {
  return value.replace(/\D/g, '').slice(0, 5);
};
