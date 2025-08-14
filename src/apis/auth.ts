import api from './index';
import type {
  RegisterRequest,
  RegisterResponse,
  LoginRequest, 
  LoginResponse,
  CommonResponse,
  ProtectedTestResponse,
  SendVerificationRequest,
  SendVerificationResponse,
  VerifyEmailRequest,
  VerifyEmailResponse,
  CheckEmailResponse
} from '@/types/api';

// 회원가입 API 호출
export const registerUser = async (data: RegisterRequest): Promise<RegisterResponse> => {
  return await api.post('/api/auth/register', data);
};

//로그인 API 호출 
export const loginUser = async (data: LoginRequest): Promise<LoginResponse> => {
  return await api.post('/api/auth/login', data);
};

// 로그아웃 API 호출
export const logoutUser = async (): Promise<CommonResponse> => {
  return await api.post('/api/auth/logout');
};

// JWT 인증 테스트 API 호출
export const testProtectedEndpoint = async (): Promise<ProtectedTestResponse> => {
  return await api.get('/api/test/protected');
};

// 이메일 인증코드 발송
export const sendVerificationCode = async (data: SendVerificationRequest): Promise<SendVerificationResponse> => {
  return await api.post('/api/auth/send-verification', data);
};

// 이메일 인증코드 검증
export const verifyEmailCode = async (data: VerifyEmailRequest): Promise<VerifyEmailResponse> => {
  return await api.post('/api/auth/verify-email', data);
};

// 이메일 중복 체크
export const checkEmailDuplicate = async (email: string): Promise<CheckEmailResponse> => {
  return await api.get(`/api/auth/check-email?email=${encodeURIComponent(email)}`);
};