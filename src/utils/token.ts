const TOKEN_KEY = 'smooth_token';

export const tokenUtils = {
  
  // 토큰 저장
  setToken: (token: string): void => {
    localStorage.setItem(TOKEN_KEY, token);
  },

  // 토큰 조회
  getToken: (): string | null => {
    return localStorage.getItem(TOKEN_KEY);
  },

  // 토큰 삭제
  removeToken: (): void => {
    localStorage.removeItem(TOKEN_KEY);
  },

  // 토큰 존재 여부 확인
  hasToken: (): boolean => {
    return !!localStorage.getItem(TOKEN_KEY);
  },

  // 토큰이 필요 없는 경로들
  isPublicPath: (path: string): boolean => {
    const publicPaths = [
      '/api/auth/login',
      '/api/auth/register',
      '/api/auth/send-verification',   
      '/api/auth/verify-email',        
      '/api/auth/check-email',         
      '/api/auth/forgot-password', //나중에 비밀번호 찾기
      '/api/public',
    ];
    
    return publicPaths.some(publicPath => path.includes(publicPath));
  }
};