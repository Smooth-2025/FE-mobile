import type { DrivingTendencyData } from '@/store/websocket/types';

// locationX, locationY logs for ego and neighbor
const egoLogs = [
  // timestamp, locationX, locationY
  ['2025-08-22T10:10:26', -67, 24.5],
  ['2025-08-22T10:10:27', -65.25, 24.5],
  ['2025-08-22T10:10:28', -59.49, 24.5],
  ['2025-08-22T10:10:29', -49.27, 24.5],
  ['2025-08-22T10:10:30', -36.03, 24.49],
];
const neighborLogs = [
  // timestamp, locationX, locationY
  ['2025-08-22T10:10:26', -67, 28],
  ['2025-08-22T10:10:27', -66.64, 28],
  ['2025-08-22T10:10:28', -63.69, 28],
  ['2025-08-22T10:10:29', -57.71, 28],
  ['2025-08-22T10:10:30', -46.35, 28.01],
];

function calcLat(baseLat: number, locationY: number): number {
  return +(baseLat + locationY / 111139).toFixed(5);
}
function calcLon(baseLon: number, locationX: number): number {
  return +(baseLon + locationX / 89000).toFixed(5);
}

export const DUMI: DrivingTendencyData[] = egoLogs.map((ego, i) => {
  const [timestamp, egoX, egoY] = ego;
  const [, neighborX, neighborY] = neighborLogs[i];
  return {
    type: 'driving',
    payload: {
      timestamp: timestamp as string,
      ego: {
        userId: 1,
        pose: {
          latitude: calcLat(37.55807, egoY as number),
          longitude: calcLon(127.00374, egoX as number),
        },
      },
      neighbors: [
        {
          userId: 2,
          character: 'lion',
          pose: {
            latitude: calcLat(37.55807, neighborY as number),
            longitude: calcLon(127.00374, neighborX as number),
          },
        },
      ],
    },
  };
});
