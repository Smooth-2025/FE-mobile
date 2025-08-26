// == 주행 더미 데이터 ==
export type Pose = { latitude: number; longitude: number };

export type Neighbor = {
  userId: number;
  character: 'lion' | 'dolphin' | 'meerkat' | 'cat';
  pose: Pose;
};
export type DrivingFrame = {
  type: 'driving';
  timestamp: string;
  ego: { userId: number; pose: Pose };
  neighbors: Neighbor[];
};
export const DUMI: DrivingFrame[] = [
  {
    type: 'driving',
    timestamp: '2025-08-22T10:10:26',
    ego: { userId: 1, pose: { latitude: 37.55842, longitude: 127.00299 } },
    neighbors: [
      { userId: 2, character: 'lion', pose: { latitude: 37.55844, longitude: 127.00301 } },
    ],
  },
  {
    type: 'driving',
    timestamp: '2025-08-22T10:10:27',
    ego: { userId: 1, pose: { latitude: 37.55842, longitude: 127.00299 } },
    neighbors: [
      { userId: 2, character: 'lion', pose: { latitude: 37.55844, longitude: 127.00301 } },
    ],
  },
  {
    type: 'driving',
    timestamp: '2025-08-22T10:10:28',
    ego: { userId: 1, pose: { latitude: 37.55843, longitude: 127.00307 } },
    neighbors: [
      { userId: 2, character: 'lion', pose: { latitude: 37.55845, longitude: 127.00309 } },
    ],
  },
  {
    type: 'driving',
    timestamp: '2025-08-22T10:10:29',
    ego: { userId: 1, pose: { latitude: 37.55843, longitude: 127.00319 } },
    neighbors: [
      { userId: 2, character: 'lion', pose: { latitude: 37.55846, longitude: 127.00321 } },
    ],
  },
  {
    type: 'driving',
    timestamp: '2025-08-22T10:10:30',
    ego: { userId: 1, pose: { latitude: 37.55843, longitude: 127.00334 } },
    neighbors: [
      { userId: 2, character: 'lion', pose: { latitude: 37.55846, longitude: 127.00336 } },
    ],
  },
  {
    type: 'driving',
    timestamp: '2025-08-22T10:10:31',
    ego: { userId: 1, pose: { latitude: 37.55843, longitude: 127.0035 } },
    neighbors: [
      { userId: 2, character: 'lion', pose: { latitude: 37.55846, longitude: 127.00352 } },
    ],
  },
  {
    type: 'driving',
    timestamp: '2025-08-22T10:10:32',
    ego: { userId: 1, pose: { latitude: 37.55843, longitude: 127.00366 } },
    neighbors: [
      { userId: 2, character: 'lion', pose: { latitude: 37.55847, longitude: 127.00368 } },
    ],
  },
  {
    type: 'driving',
    timestamp: '2025-08-22T10:10:33',
    ego: { userId: 1, pose: { latitude: 37.55843, longitude: 127.00387 } },
    neighbors: [
      { userId: 2, character: 'lion', pose: { latitude: 37.55847, longitude: 127.00389 } },
    ],
  },
  {
    type: 'driving',
    timestamp: '2025-08-22T10:10:34',
    ego: { userId: 1, pose: { latitude: 37.55843, longitude: 127.00401 } },
    neighbors: [
      { userId: 2, character: 'lion', pose: { latitude: 37.55847, longitude: 127.00403 } },
    ],
  },
  {
    type: 'driving',
    timestamp: '2025-08-22T10:10:35',
    ego: { userId: 1, pose: { latitude: 37.55843, longitude: 127.00414 } },
    neighbors: [
      { userId: 2, character: 'lion', pose: { latitude: 37.55848, longitude: 127.00416 } },
    ],
  },
  {
    type: 'driving',
    timestamp: '2025-08-22T10:10:36',
    ego: { userId: 1, pose: { latitude: 37.55843, longitude: 127.00423 } },
    neighbors: [
      { userId: 2, character: 'lion', pose: { latitude: 37.55848, longitude: 127.00425 } },
    ],
  },
  {
    type: 'driving',
    timestamp: '2025-08-22T10:10:37',
    ego: { userId: 1, pose: { latitude: 37.55843, longitude: 127.00436 } },
    neighbors: [
      { userId: 2, character: 'lion', pose: { latitude: 37.55848, longitude: 127.00438 } },
    ],
  },
  {
    type: 'driving',
    timestamp: '2025-08-22T10:10:38',
    ego: { userId: 1, pose: { latitude: 37.55843, longitude: 127.0045 } },
    neighbors: [
      { userId: 2, character: 'lion', pose: { latitude: 37.55848, longitude: 127.00452 } },
    ],
  },
  {
    type: 'driving',
    timestamp: '2025-08-22T10:10:39',
    ego: { userId: 1, pose: { latitude: 37.55843, longitude: 127.00466 } },
    neighbors: [
      { userId: 2, character: 'lion', pose: { latitude: 37.55849, longitude: 127.00468 } },
    ],
  },
  {
    type: 'driving',
    timestamp: '2025-08-22T10:10:40',
    ego: { userId: 1, pose: { latitude: 37.55843, longitude: 127.00479 } },
    neighbors: [
      { userId: 2, character: 'lion', pose: { latitude: 37.55849, longitude: 127.00481 } },
    ],
  },
  {
    type: 'driving',
    timestamp: '2025-08-22T10:10:41',
    ego: { userId: 1, pose: { latitude: 37.55843, longitude: 127.00483 } },
    neighbors: [
      { userId: 2, character: 'lion', pose: { latitude: 37.55849, longitude: 127.00485 } },
    ],
  },
  {
    type: 'driving',
    timestamp: '2025-08-22T10:10:42',
    ego: { userId: 1, pose: { latitude: 37.55843, longitude: 127.00485 } },
    neighbors: [
      { userId: 2, character: 'lion', pose: { latitude: 37.55849, longitude: 127.00487 } },
    ],
  },
  {
    type: 'driving',
    timestamp: '2025-08-22T10:10:43',
    ego: { userId: 1, pose: { latitude: 37.55843, longitude: 127.00486 } },
    neighbors: [
      { userId: 2, character: 'lion', pose: { latitude: 37.55849, longitude: 127.00488 } },
    ],
  },
  {
    type: 'driving',
    timestamp: '2025-08-22T10:10:44',
    ego: { userId: 1, pose: { latitude: 37.55843, longitude: 127.00486 } },
    neighbors: [
      { userId: 2, character: 'lion', pose: { latitude: 37.55849, longitude: 127.00488 } },
    ],
  },
];
