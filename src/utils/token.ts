const ACCESS_TOKEN_KEY = 'smooth_access_token';

export const tokenUtils = {
  // Access Token 저장 (sessionStorage)
  setAccessToken: (token: string): void => {
    sessionStorage.setItem(ACCESS_TOKEN_KEY, token);
  },

  // Access Token 조회
  getAccessToken: (): string | null => {
    return sessionStorage.getItem(ACCESS_TOKEN_KEY);
  },

  // Access Token 삭제
  removeAccessToken: (): void => {
    sessionStorage.removeItem(ACCESS_TOKEN_KEY);
  },

  // 모든 토큰 정리
  clearAllTokens: (): void => {
    sessionStorage.removeItem(ACCESS_TOKEN_KEY);
    // Refresh Token은 쿠키이므로 서버에서 삭제 (로그아웃 API 호출)
  },

  // Access Token 존재 여부 확인
  hasAccessToken: (): boolean => {
    return !!sessionStorage.getItem(ACCESS_TOKEN_KEY);
  },

  // 기존 메소드들 (호환성 유지)
  setToken: (token: string): void => {
    tokenUtils.setAccessToken(token);
  },

  getToken: (): string | null => {
    return tokenUtils.getAccessToken();
  },

  removeToken: (): void => {
    tokenUtils.removeAccessToken();
  },

  hasToken: (): boolean => {
    return tokenUtils.hasAccessToken();
  },

  // 토큰이 필요 없는 경로들
  isPublicPath: (path: string): boolean => {
    const publicPaths = [
      '/api/users/auth/login',
      '/api/users/auth/register',
      '/api/users/auth/send-verification',
      '/api/users/auth/verify-email', 
      '/api/users/auth/check-email',
      '/api/users/auth/refresh',
    ];

    return publicPaths.some((publicPath) => path.includes(publicPath));
  },
};