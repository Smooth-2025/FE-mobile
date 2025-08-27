import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import type { Group } from 'three';

const SCALE = { forward: 1, lateral: 1 };

export default function DrivingLane({
  getSpeed,
  getTurn = () => 0,
}: {
  getSpeed: () => number;
  getTurn?: () => number;
}) {
  const groupRef = useRef<Group>(null);
  const offsetRef = useRef(0);

  useFrame((_, delta) => {
    if (!groupRef.current) return;

    const v = getSpeed();
    const turn = getTurn();

    if (Math.abs(v) > 1e-3) {
      offsetRef.current += v * delta;
    }

    if (offsetRef.current > 50) offsetRef.current = -50;
    if (offsetRef.current < -50) offsetRef.current = 50;

    const children = groupRef.current.children;
    const half = Math.floor(children.length / 2);

    children.forEach((child, index) => {
      const isLeft = index < half;
      const markingIndex = isLeft ? index : index - half;
      const baseZ = markingIndex * 6 - 60 + offsetRef.current;

      const curveOffset = turn * Math.sin((baseZ + offsetRef.current) * 0.02) * 1.2;

      const laneX = 1 * SCALE.lateral;
      child.position.set(isLeft ? -laneX + curveOffset : laneX + curveOffset, 0.01, baseZ);
      child.rotation.y = turn * Math.sin((baseZ + offsetRef.current) * 0.02) * 0.2;
    });
  });

  const laneX = 1 * SCALE.lateral;
  const markings = [];
  for (let i = -60; i < 60; i += 6) {
    markings.push(
      <mesh key={`left-${i}`} position={[-laneX, 0.01, i]}>
        <boxGeometry args={[0.1, 0.01, 3]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>,
    );
  }
  for (let i = -60; i < 60; i += 6) {
    markings.push(
      <mesh key={`right-${i}`} position={[laneX, 0.01, i]}>
        <boxGeometry args={[0.1, 0.01, 3]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>,
    );
  }

  return <group ref={groupRef}>{markings}</group>;
}
