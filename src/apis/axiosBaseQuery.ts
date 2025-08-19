import api from './index';
import type { BaseQueryFn } from '@reduxjs/toolkit/query';
import type { AxiosError, AxiosRequestConfig } from 'axios';

type AxiosArgs = {
  url: string;
  method?: AxiosRequestConfig['method'];
  data?: AxiosRequestConfig['data'];
  params?: AxiosRequestConfig['params'];
  headers?: AxiosRequestConfig['headers'];
};
type BackendError = {
  success: false;
  code: number;
  message: string;
  data: unknown;
};

export const axiosBaseQuery =
  ({ baseUrl = '' }: { baseUrl?: string } = {}): BaseQueryFn<AxiosArgs, unknown, unknown> =>
  async ({ url, method = 'GET', data, params, headers }) => {
    try {
      const result = await api({ url: baseUrl + url, method, data, params, headers });
      return result;
    } catch (err) {
      const e = err as AxiosError<BackendError>;
      const code = e.response?.data?.code;

      const isLinkStatusGet = (method ?? 'GET').toUpperCase() === 'GET' && url === '/vehicle';

      if (code === 4010 && isLinkStatusGet) {
        return { data: { linked: false, vehicle: null } };
      }

      return {
        error: {
          status: e.response?.status ?? 0,
          data: e.response?.data as BackendError,
        },
      };
    }
  };
