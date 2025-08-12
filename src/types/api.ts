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
  userId: number;
  name: string;
  token: string;
}

// 로그인 응답 (LoginResponseDto와 매칭)
export interface LoginResponse extends BaseResponse {
  userId: number;
  name: string;
  token: string;
}

// 단순 성공/실패 응답 (로그아웃 등에서 사용)
// export interface CommonResponse extends BaseResponse {
//   // BaseResponse와 동일하지만 명시적으로 구분
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