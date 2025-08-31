import type { Timeline, TimelineItem } from '@/store/driving/type';

// 샘플 시드 (최신순 정렬)
const seed_all: TimelineItem[] = (() => {
  const base = new Date('2025-09-10T15:36:00Z').getTime();
  const mk = (min: number) => new Date(base - min * 60_000).toISOString();
  const arr: TimelineItem[] = [
    {
      id: '1',
      type: 'DRIVING',
      createdAt: mk(0),
      status: 'PROCESSING',
      data: {
        id: 123,
        startTime: mk(70),
        endTime: mk(0),
        totalDistance: 25.7,
        avgSpeed: 33.7,
        cruiseRatio: 78,
        laneChangeCount: 4,
        hardBrakeCount: 1,
        rapidAccelCount: 2,
        sharpTurnCount: 3,
        drivingMinutes: 72,
      },
    },
    {
      id: '2',
      type: 'REPORT',
      createdAt: mk(600),
      status: 'PROCESSING',
      data: { id: 456, isRead: true },
    },
    {
      id: '3',
      type: 'REPORT',
      createdAt: mk(600),
      status: 'COMPLETED',
      data: { id: 457, isRead: false },
    },
    {
      id: '4',
      type: 'REPORT',
      createdAt: mk(600),
      status: 'PROCESSING',
      data: { id: 458, isRead: false },
    },
    {
      id: '5',
      type: 'REPORT',
      createdAt: mk(600),
      status: 'PROCESSING',
      data: { id: 600, isRead: false },
    },
    {
      id: '6',
      type: 'DRIVING',
      createdAt: mk(620),
      status: 'COMPLETED',
      data: {
        id: 122,
        startTime: mk(690),
        endTime: mk(620),
        totalDistance: 18.3,
        avgSpeed: 28.5,
        cruiseRatio: 72,
        laneChangeCount: 6,
        hardBrakeCount: 0,
        rapidAccelCount: 1,
        sharpTurnCount: 2,
        drivingMinutes: 72,
      },
    },
    {
      id: '7',
      type: 'DRIVING',
      createdAt: mk(800),
      status: 'COMPLETED',
      data: {
        id: 121,
        startTime: mk(870),
        endTime: mk(800),
        totalDistance: 30.2,
        avgSpeed: 40.1,
        cruiseRatio: 80,
        laneChangeCount: 3,
        hardBrakeCount: 1,
        rapidAccelCount: 0,
        sharpTurnCount: 1,
        drivingMinutes: 72,
      },
    },
    {
      id: '8',
      type: 'REPORT',
      createdAt: mk(820),
      status: 'COMPLETED',
      data: { id: 459, isRead: true },
    },
    {
      id: '9',
      type: 'DRIVING',
      createdAt: mk(900),
      status: 'COMPLETED',
      data: {
        id: 120,
        startTime: mk(970),
        endTime: mk(900),
        totalDistance: 12.5,
        avgSpeed: 25.4,
        cruiseRatio: 65,
        laneChangeCount: 5,
        hardBrakeCount: 2,
        rapidAccelCount: 1,
        sharpTurnCount: 0,

        drivingMinutes: 72,
      },
    },
  ];
  return arr.sort((a, b) => (a.createdAt > b.createdAt ? -1 : 1));
})();
const seed_driving: TimelineItem[] = (() => {
  const base = new Date('2025-09-10T15:36:00Z').getTime();
  const mk = (min: number) => new Date(base - min * 60_000).toISOString();
  const arr: TimelineItem[] = [
    {
      id: '1',
      type: 'DRIVING',
      createdAt: mk(0),
      status: 'PROCESSING',
      data: {
        id: 123,
        startTime: mk(70),
        endTime: mk(0),
        totalDistance: 25.7,
        avgSpeed: 33.7,
        cruiseRatio: 78,
        laneChangeCount: 4,
        hardBrakeCount: 1,
        rapidAccelCount: 2,
        sharpTurnCount: 3,
        drivingMinutes: 72,
      },
    },
    {
      id: '6',
      type: 'DRIVING',
      createdAt: mk(620),
      status: 'COMPLETED',
      data: {
        id: 122,
        startTime: mk(690),
        endTime: mk(620),
        totalDistance: 18.3,
        avgSpeed: 28.5,
        cruiseRatio: 72,
        laneChangeCount: 6,
        hardBrakeCount: 0,
        rapidAccelCount: 1,
        sharpTurnCount: 2,
        drivingMinutes: 72,
      },
    },
    {
      id: '7',
      type: 'DRIVING',
      createdAt: mk(800),
      status: 'COMPLETED',
      data: {
        id: 121,
        startTime: mk(870),
        endTime: mk(800),
        totalDistance: 30.2,
        avgSpeed: 40.1,
        cruiseRatio: 80,
        laneChangeCount: 3,
        hardBrakeCount: 1,
        rapidAccelCount: 0,
        sharpTurnCount: 1,
        drivingMinutes: 72,
      },
    },
    {
      id: '9',
      type: 'DRIVING',
      createdAt: mk(900),
      status: 'COMPLETED',
      data: {
        id: 120,
        startTime: mk(970),
        endTime: mk(900),
        totalDistance: 12.5,
        avgSpeed: 25.4,
        cruiseRatio: 65,
        laneChangeCount: 5,
        hardBrakeCount: 2,
        rapidAccelCount: 1,
        sharpTurnCount: 0,

        drivingMinutes: 72,
      },
    },
  ];
  return arr.sort((a, b) => (a.createdAt > b.createdAt ? -1 : 1));
})();
const seed_reports: TimelineItem[] = (() => {
  const base = new Date('2025-09-10T15:36:00Z').getTime();
  const mk = (min: number) => new Date(base - min * 60_000).toISOString();
  const arr: TimelineItem[] = [
    {
      id: '2',
      type: 'REPORT',
      createdAt: mk(600),
      status: 'PROCESSING',
      data: { id: 456, isRead: true },
    },
    {
      id: '3',
      type: 'REPORT',
      createdAt: mk(600),
      status: 'COMPLETED',
      data: { id: 457, isRead: false },
    },
    {
      id: '4',
      type: 'REPORT',
      createdAt: mk(600),
      status: 'PROCESSING',
      data: { id: 458, isRead: false },
    },
    {
      id: '5',
      type: 'REPORT',
      createdAt: mk(600),
      status: 'PROCESSING',
      data: { id: 600, isRead: false },
    },
    {
      id: '8',
      type: 'REPORT',
      createdAt: mk(820),
      status: 'COMPLETED',
      data: { id: 459, isRead: true },
    },
  ];
  return arr.sort((a, b) => (a.createdAt > b.createdAt ? -1 : 1));
})();

function pageSlice(list: TimelineItem[], limit: number, cursor?: string | null): Timeline {
  if (!limit || limit < 1) limit = 3;

  if (!cursor) {
    const items = list.slice(0, limit);
    const last = items[items.length - 1];
    const hasMore = list.length > limit;
    return {
      items,
      nextCursor: hasMore ? (last?.createdAt ?? null) : null,
      hasMore,
    };
  }

  const idx = list.findIndex((x) => x.createdAt === cursor);
  const start = idx >= 0 ? idx + 1 : 0;
  const items = list.slice(start, start + limit);
  const last = items[items.length - 1];
  const hasMore = start + limit < list.length;
  return {
    items,
    nextCursor: hasMore ? (last?.createdAt ?? null) : null,
    hasMore,
  };
}

export const getAll = (limit: number, cursor?: string | null) => pageSlice(seed_all, limit, cursor);
export const getDrivingOnly = (limit: number, cursor?: string | null) =>
  pageSlice(seed_driving, limit, cursor);
export const getReportsOnly = (limit: number, cursor?: string | null) =>
  pageSlice(seed_reports, limit, cursor);
