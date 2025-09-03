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
  CheckEmailResponse,
  UserProfileResponse,
  ChangePasswordRequest,
  BaseResponse,
  UpdateEmergencyInfoRequest,
} from '@/types/api';

// 회원가입 API 호출
export const registerUser = async (data: RegisterRequest): Promise<RegisterResponse> => {
  return await api.post('/api/users/auth/register', data);
};

// 로그인 API 호출 
export const loginUser = async (data: LoginRequest): Promise<LoginResponse> => {
  return await api.post('/api/users/auth/login', data);
};

// 로그아웃 API 호출
export const logoutUser = async (): Promise<CommonResponse> => {
  return await api.post('/api/users/auth/logout');
};

// 회원탈퇴 API 호출
export const deleteAccount = async (): Promise<CommonResponse> => {
  return await api.delete('/api/users/account');
};

// 사용자 프로필 조회 API
export const getUserProfile = async (): Promise<UserProfileResponse> => {
  return await api.get('/api/users/profile');
};

// JWT 인증 테스트 API 호출
export const testProtectedEndpoint = async (): Promise<ProtectedTestResponse> => {
  return await api.get('/api/users/test/protected');
};

// 이메일 인증코드 발송
export const sendVerificationCode = async (
  data: SendVerificationRequest,
): Promise<SendVerificationResponse> => {
  return await api.post('/api/users/auth/send-verification', data);
};

// 이메일 인증코드 검증
export const verifyEmailCode = async (data: VerifyEmailRequest): Promise<VerifyEmailResponse> => {
  return await api.post('/api/users/auth/verify-email', data);
};

// 이메일 중복 체크 - 응답 구조 변경에 맞춰 수정
export const checkEmailDuplicate = async (email: string): Promise<boolean> => {
  const response: CheckEmailResponse = await api.get(`/api/users/auth/check-email?email=${encodeURIComponent(email)}`);
  return response.data.isDuplicate;
};

// 비밀번호 변경
export const changePassword = async (data: ChangePasswordRequest): Promise<BaseResponse> => {
  try {
    const response = await api.put<BaseResponse>('/api/users/password', data);
    return response.data;
  } catch (error) {
    console.error('비밀번호 변경 API 에러:', error);
    throw error;
  }
};

// 응급정보 수정
export const updateEmergencyInfo = async (data: UpdateEmergencyInfoRequest): Promise<UserProfileResponse> => {
  try {
    const response = await api.put<UserProfileResponse>('/api/users/emergency-info', data);
    return response.data;
  } catch (error) {
    console.error('응급정보 수정 API 에러:', error);
    throw error;
  }
};