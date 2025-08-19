import axios, { type AxiosResponse, type InternalAxiosRequestConfig } from 'axios';
import { tokenUtils } from '@/utils/token';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
});

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
  (error) => {
    // 401 에러
    if (error.response?.status === 401) {
      console.warn('인증이 만료되었습니다.');
      tokenUtils.removeToken();

      // 로그인 페이지가 아닌 경우에만 리다이렉트
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  },
);

export default api;
