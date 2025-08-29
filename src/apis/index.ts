import axios, { type AxiosResponse, type InternalAxiosRequestConfig } from 'axios';
import { tokenUtils } from '@/utils/token';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 5000,
  withCredentials: true,  // 쿠키 포함 설정
  headers: {
    'Content-Type': 'application/json',
  },
});

// 토큰 갱신 중 플래그 (중복 호출 방지)
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value: unknown) => void;
  reject: (reason: unknown) => void;
}> = [];

// 대기열 처리 함수
const processQueue = (error: unknown = null, token: string | null = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(token);
    }
  });
  
  failedQueue = [];
};

//요청 인터셉터
api.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    // 특정 경로가 아닌 경우에만 토큰넣기
    if (config.url && !tokenUtils.isPublicPath(config.url)) {
      const token = tokenUtils.getToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error),
);

//응답 인터셉터
api.interceptors.response.use(
  (response: AxiosResponse) => response.data,
  async (error) => {
    const originalRequest = error.config;

    // 401 에러 처리
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // 이미 갱신 중이면 대기열에 추가
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(token => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return api(originalRequest);
        }).catch(err => {
          return Promise.reject(err);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // 토큰 갱신 시도
        const refreshResponse = await api.post('/api/users/auth/refresh');
        const newAccessToken = refreshResponse.data.accessToken;
        
        // 새 토큰 저장
        tokenUtils.setAccessToken(newAccessToken);
        
        // 대기열 처리
        processQueue(null, newAccessToken);
        
        // 원래 요청 재시도
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        // 갱신 실패 시 로그아웃 처리
        processQueue(refreshError, null);
        tokenUtils.clearAllTokens();
        
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);

export default api;
