import { Suspense, useState, useEffect, useRef, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, OrbitControls, Html } from '@react-three/drei';
import { DUMI, type DrivingFrame } from '@/components/driving/dumiData';
import SimulationGround from '@/components/driving/SimulationGround';
import SimulationCar from '@/components/driving/SimulationCar';
import DumiHUD from '@/components/driving/DumiHUD';
import * as styled from '@/components/driving/DrivingSimulation.styles';
import lion from '@/assets/images/characters/lion.png';
import dolphin from '@/assets/images/characters/dolphin.png';
import cat from '@/assets/images/characters/cat.png';
import meerkat from '@/assets/images/characters/meerkat.png';

// 화면 스케일
const SCALE = { forward: 10, lateral: 1 };

// 카메라 기본값
const CAMERA_POS: [number, number, number] = [0, 5, 20];
const CAMERA_FOV = 55;

// 성향 이미지
const CHARACTER_IMG: Record<string, string> = {
  lion: lion,
  dolphin: dolphin,
  meerkat: meerkat,
  cat: cat,
};

// 각도 -π~π 정규화 (한바퀴 이상 회전 방지)
function normAngle(rad: number): number {
  const x = ((((rad + Math.PI) % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI)) - Math.PI;
  return x;
}

// 에고 기준 상대 → three.js 화면 좌표
// CARLA: x=앞/뒤, y=좌/우  →  three.js: z=앞, x=좌/우
function carlaRelativeToScene(
  ego: { x: number; y: number; yaw: number },
  other: { x: number; y: number },
  scale: { forward: number; lateral: number },
): { sx: number; sz: number } {
  const dx = other.x - ego.x;
  const dy = other.y - ego.y;

  const cos = Math.cos(-ego.yaw);
  const sin = Math.sin(-ego.yaw);
  const relForward = dx * cos - dy * sin; // +앞
  const relLateral = dx * sin + dy * cos; // +좌
  return {
    sx: relLateral * scale.lateral, // 화면 x
    sz: -relForward * scale.forward, // 화면 z
  };
}

export default function DrivingSimulation() {
  // 프레임 시퀀스(오름차순 정렬 보장)
  const frames: DrivingFrame[] = useMemo(
    () => DUMI.slice().sort((a, b) => a.timestamp.localeCompare(b.timestamp)),
    [],
  );

  const len = frames.length;
  const idxRef = useRef(0);
  const [cur, setCur] = useState<DrivingFrame | null>(len ? frames[0] : null);

  // 1초 간격 재생(더미 데이터용)
  useEffect(() => {
    if (len === 0) return;
    const id = window.setInterval(() => {
      idxRef.current = Math.min(idxRef.current + 1, len - 1);
      setCur(frames[idxRef.current]);
    }, 1000);
    return () => window.clearInterval(id);
  }, [len, frames]);

  const ego = cur?.ego;
  const neighbors = cur?.neighbors ?? [];

  return (
    <div style={{ width: '100%', height: '100vh' }}>
      <Canvas dpr={[1, 2]} shadows camera={{ position: CAMERA_POS, fov: CAMERA_FOV }}>
        <color attach="background" args={['#2a2a2a']} />
        <directionalLight
          position={[8, 12, 10]}
          intensity={1.1}
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />
        <ambientLight intensity={0.35} />

        <Suspense fallback={null}>
          <Environment preset="city" />
          {/* == 시뮬레이션 바닥 == */}
          <SimulationGround />
          {/* == 에고: 원점 고정, yaw만 반영 == */}
          {ego && (
            <group position={[0, 0.0, 0]} rotation={[0, ego.pose.yaw, 0]}>
              <SimulationCar variant="ego" />
            </group>
          )}
          {/* == 이웃 차량: 에고 기준 상대 좌표/방향 == */}
          {ego &&
            neighbors.map((nb) => {
              const rel = carlaRelativeToScene(
                { x: ego.pose.x, y: ego.pose.y, yaw: ego.pose.yaw },
                { x: nb.pose.x, y: nb.pose.y },
                SCALE,
              );
              const relYaw = normAngle(nb.pose.yaw - ego.pose.yaw);
              return (
                <group key={nb.userId} position={[rel.sx, 0, rel.sz]} rotation={[0, relYaw, 0]}>
                  <SimulationCar variant="neighbor" />
                  <Html position={[0, 1.0, 0]} center distanceFactor={10} transform>
                    <styled.Character>
                      <styled.CharacterImg src={CHARACTER_IMG[nb.character]} alt={nb.character} />
                    </styled.Character>
                  </Html>
                </group>
              );
            })}
          <OrbitControls enablePan={false} enableDamping dampingFactor={0.08} />
        </Suspense>
      </Canvas>
      {/* == 더미 데이터 == */}
      <DumiHUD
        currentIndex={idxRef.current}
        total={frames.length}
        ego={cur?.ego ?? null}
        neighbors={cur?.neighbors ?? []}
        timestamp={cur?.timestamp ?? null}
        humanTime={(iso) => new Date(iso).toLocaleTimeString(undefined, { hour12: false })}
      />
    </div>
  );
}
