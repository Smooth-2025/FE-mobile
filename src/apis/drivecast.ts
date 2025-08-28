import axios from 'axios';
import { tokenUtils } from '@/utils/token';

const DRIVECAST_BASE_URL = import.meta.env.VITE_DRIVECAST_API_BASE_URL || 'http://localhost:8080';

const drivecastApi = axios.create({
  baseURL: DRIVECAST_BASE_URL,
  timeout: 5000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 요청 인터셉터 - JWT 토큰 추가
drivecastApi.interceptors.request.use(
  (config) => {
    const token = tokenUtils.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// 응답 인터셉터 - 데이터 추출
drivecastApi.interceptors.response.use(
  (response) => response.data,
  (error) => Promise.reject(error),
);

export default drivecastApi;