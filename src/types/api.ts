// 회원가입 요청 데이터 (RegisterRequestDto와 매칭)
export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
  phone: string;
  gender: 'MALE' | 'FEMALE'; // 백엔드의 enum과 매칭
  bloodType?: 'A' | 'B' | 'AB' | 'O'; // 선택사항이라 ?를 붙임
  emergencyContact1?: string;
  emergencyContact2?: string;
  emergencyContact3?: string;
  termsOfServiceAgreed: boolean;
  privacyPolicyAgreed: boolean;
}

// 로그인 요청 데이터 (LoginRequestDto와 매칭)
export interface LoginRequest {
  email: string;
  password: string;
}

// API 응답 기본 구조
// 모든 응답의 기본 형태 (CommonResponseDto와 매칭)
export interface BaseResponse {
  success: boolean;
  message: string;
}

// 회원가입 응답 (RegisterResponseDto와 매칭)
export interface RegisterResponse extends BaseResponse {
  data: {
    userId: number;
    name: string;
    token: string;
  };
}

// 로그인 응답 (LoginResponseDto와 매칭)
export interface LoginResponse extends BaseResponse {
  data: {
    userId: number;
    name: string;
    token: string;
  };
}

// 단순 성공/실패 응답 (로그아웃 등에서 사용)
// export interface CommonResponse extends BaseResponse {
  // BaseResponse와 동일하지만 명시적으로 구분
// }

export type CommonResponse = BaseResponse;

// 테스트 API 응답
// /api/test/protected 응답
export interface ProtectedTestResponse {
  success: boolean;
  message: string;
  userId: number;
  timestamp: number;
}

//사용자 정보 타입 (추후 확장용)
export interface User {
  id: number;
  email: string;
  name: string;
  phone: string;
  gender: 'MALE' | 'FEMALE';
  bloodType?: 'A' | 'B' | 'AB' | 'O';
  emergencyContact1?: string;
  emergencyContact2?: string;
  emergencyContact3?: string;
  termsOfServiceAgreed: boolean;
  privacyPolicyAgreed: boolean;
  termsAgreedAt: string; // ISO 날짜 문자열
}
// 에러 응답 타입
export interface ErrorResponse {
  success: false;
  message: string;
  // 필요하면 에러 코드나 상세 정보 추가 가능
  errorCode?: string;
  details?: Record<string, unknown>;
}
// 이메일 인증코드 발송 요청
export interface SendVerificationRequest {
  email: string;
}

// 이메일 인증코드 발송 응답
export interface SendVerificationResponse extends BaseResponse {
  data: {
    email: string;
    expirationTime: number; // 만료시간 (초)
  };
}

// 이메일 인증코드 검증 요청
export interface VerifyEmailRequest {
  email: string;
  code: string;
}

// 이메일 인증코드 검증 응답
export interface VerifyEmailResponse extends BaseResponse {
  data: {
    email: string;
    verified: boolean;
  };
}

// 이메일 중복 체크 응답
export interface CheckEmailResponse {
  data: {
    isDuplicate: boolean;
  };
}

// 회원가입 단계 타입 (4단계)
export type SignupStep = 'email' | 'profile' | 'terms' | 'emergency' | 'complete';

// 회원가입 상태 타입
export interface SignupState {
  currentStep: SignupStep;
  email: string;
  isEmailVerified: boolean;
  profileFormData: ProfileFormData | null;
  agreementState: AgreementState | null;
  emergencyFormData: EmergencyFormData | null;
}

// 2단계: 필수정보 입력 데이터
export interface ProfileFormData {
  password: string;
  passwordConfirm: string;
  name: string;
  phone: string;
  gender: 'MALE' | 'FEMALE' | '';
}

// 폼 에러 타입
export interface ProfileFormErrors {
  password?: string;
  passwordConfirm?: string;
  name?: string;
  phone?: string;
  gender?: string;
}

// 폼 성공 메시지 타입
export interface ProfileFormSuccess {
  password?: string;
  passwordConfirm?: string;
}

// 유효성 검사 결과 타입
export interface ValidationResult {
  error?: string;
  success?: string;
}

// 3단계: 약관동의 데이터
export interface AgreementState {
  allAgreed: boolean;
  termsOfService: boolean;
  privacyPolicy: boolean;
}

// 약관 동의 훅 반환 타입
export interface UseTermsAgreementReturn {
  agreements: AgreementState;
  handleAllAgreementChange: (checked: boolean) => void;
  handleIndividualAgreementChange: (
    key: keyof Omit<AgreementState, 'allAgreed'>,
  ) => (checked: boolean) => void; // 🔧 수정
  isAllRequiredAgreed: boolean;
}

// 4단계: 응급정보 데이터 (모두 선택사항)
export interface EmergencyFormData {
  bloodType: 'A' | 'B' | 'O' | 'AB' | '';
  emergencyContact1: string;
  emergencyContact2: string;
  emergencyContact3: string;
}

// 응급정보 폼 에러 타입
export interface EmergencyFormErrors {
  emergencyContact1?: string;
  emergencyContact2?: string;
  emergencyContact3?: string;
}

// 응급정보 훅 반환 타입
export interface UseEmergencyFormReturn {
  formData: EmergencyFormData;
  formErrors: EmergencyFormErrors;
  handleInputChange: (
    field: keyof EmergencyFormData,
  ) => (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleBloodTypeSelect: (bloodType: 'A' | 'B' | 'O' | 'AB') => void;
  handleFieldBlur: (field: keyof EmergencyFormData) => () => void;
}

// 최종 회원가입 요청 (기존 RegisterRequest 대체할 수도 있음)
export interface CompleteSignupRequest {
  email: string;
  password: string;
  name: string;
  phone: string;
  gender: 'MALE' | 'FEMALE';
  termsOfServiceAgreed: boolean;
  privacyPolicyAgreed: boolean;
  marketingAgreed?: boolean;
  bloodType?: 'A' | 'B' | 'AB' | 'O';
  emergencyContact1?: string;
  emergencyContact2?: string;
  emergencyContact3?: string;
}