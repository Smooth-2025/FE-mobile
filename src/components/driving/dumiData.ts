export type Pose = { x: number; y: number; yaw: number };

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
    ego: { userId: 1, pose: { x: -67, y: 24.5, yaw: 0.01 } },
    neighbors: [
      {
        userId: 2,
        character: 'lion',
        pose: { x: -67, y: 28, yaw: 0.01 },
      },
    ],
  },
  {
    type: 'driving',
    timestamp: '2025-08-22T10:10:27',
    ego: { userId: 1, pose: { x: -65.25, y: 24.5, yaw: 0.01 } },
    neighbors: [
      {
        userId: 3,
        character: 'dolphin',
        pose: { x: -66.64, y: 28.0, yaw: 0.01 },
      },
    ],
  },
  {
    type: 'driving',
    timestamp: '2025-08-22T10:10:28',
    ego: { userId: 1, pose: { x: -59.49, y: 24.5, yaw: 0.03 } },
    neighbors: [
      {
        userId: 4,
        character: 'cat',
        pose: { x: -63.69, y: 28, yaw: 0.1 },
      },
    ],
  },
];
