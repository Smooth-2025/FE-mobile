import axios, { type AxiosResponse, type InternalAxiosRequestConfig } from 'axios';

const api = axios.create({
  baseURL: '', 
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
});


//요청 인터셉터
api.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const token = '';
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

//응답 인터셉터
api.interceptors.response.use(
  (response: AxiosResponse) => response.data,
  (error) => {
    return Promise.reject(error);
  },
);

export default api;
