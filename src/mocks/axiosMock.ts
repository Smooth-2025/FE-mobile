import MockAdapter from 'axios-mock-adapter';
import api from '@/apis'; // axios 인스턴스
import { getAll, getDrivingOnly, getReportsOnly } from './timelineMock';

export function installAxiosMock() {
  const mock = new MockAdapter(api, { delayResponse: 300 });

  // 전체
  mock.onGet('/api/driving-analysis/timeline').reply((config) => {
    const url = new URL(config.url!, window.location.origin);
    const limit = Number(url.searchParams.get('limit') ?? '5');
    const cursor = url.searchParams.get('cursor');
    return [200, getAll(limit, cursor)];
  });

  // 주행
  mock.onGet('/api/driving-analysis/timeline/driving').reply((config) => {
    const url = new URL(config.url!, window.location.origin);
    const limit = Number(url.searchParams.get('limit') ?? '5');
    const cursor = url.searchParams.get('cursor');
    return [200, getDrivingOnly(limit, cursor)];
  });

  // 리포트
  mock.onGet('/api/driving-analysis/timeline/reports').reply((config) => {
    const url = new URL(config.url!, window.location.origin);
    const limit = Number(url.searchParams.get('limit') ?? '5');
    const cursor = url.searchParams.get('cursor');
    return [200, getReportsOnly(limit, cursor)];
  });
}
