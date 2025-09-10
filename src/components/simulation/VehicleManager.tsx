import { useEffect, useRef, useState } from 'react';
import styled from '@emotion/styled';
import { useSelector } from 'react-redux';
import { Html } from '@react-three/drei';
import { useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { selectCurrentDrivingData } from '@/store/slices/drivingSlice';
import lion from '@/assets/images/characters/lion.png';
import dolphin from '@/assets/images/characters/dolphin.png';
import cat from '@/assets/images/characters/cat.png';
import meerkat from '@/assets/images/characters/meerkat.png';
import SimulationCar from './SimulationCar';
import { latLonToCarlaXY, ROAD_SCALE } from './utils/coordinateUtils';

export const Character = styled.div`
  width: 15px;
  height: 15px;
  border-radius: 50%;
  background: rgba(176, 176, 176, 0);
  padding: 2px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
  pointer-events: none;
`;

export const CharacterImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: contain;
  display: block;
  image-rendering: -webkit-optimize-contrast;
  image-rendering: crisp-edges;
`;

const CHARACTER_IMG = {
  LION: lion,
  DOLPHIN: dolphin,
  MEERKAT: meerkat,
  CAT: cat,
} as const;

type CharacterKey = keyof typeof CHARACTER_IMG;

type ScenePos = {
  ego: { sx: number; sz: number };
  nbs: Array<{
    userId: number | string;
    sx: number;
    sz: number;
    theta: number;
    character: CharacterKey;
  }>;
};

function ChaseCam({
  getEgo,
  back = 12,
  height = 5,
  lerp = 0.15,
}: {
  getEgo: () => { sx: number; sz: number; theta: number } | null;
  back?: number;
  height?: number;
  lerp?: number;
}) {
  const { camera } = useThree();
  const pos = new THREE.Vector3();
  const target = new THREE.Vector3();
  const initialized = useRef(false); // 초기화 여부

  useFrame((_, dt) => {
    const ego = getEgo();
    if (!ego) return;

    const forwardX = Math.sin(ego.theta);
    const forwardZ = Math.cos(ego.theta);

    target.set(ego.sx, 0, ego.sz);

    // 카메라 위치 = 차량 위치 - 진행방향 * back + 높이
    pos.set(ego.sx - forwardX * back, height, ego.sz - forwardZ * back);

    if (!initialized.current) {
      // 첫 프레임은 튕김 방지
      camera.position.copy(pos);
      camera.lookAt(target);
      initialized.current = true;
      return;
    }

    // 이후에는 보간
    const a = 1 - Math.exp(-dt / lerp);
    camera.position.lerp(pos, a);
    camera.lookAt(target);
  });

  return null;
}

export default function VehicleManager() {
  const current = useSelector(selectCurrentDrivingData);
  const [scenePos, setScenePos] = useState<ScenePos | null>(null);

  // 차량 중심 좌표계를 위한 상태 추가
  const [egoWorldPos, setEgoWorldPos] = useState<{ e: number; n: number; theta: number }>({
    e: 0,
    n: 0,
    theta: 0,
  });

  // 더미 데이터의 대략적인 중심점 (차량 좌표 범위의 중심)
  const VEHICLE_CENTER_OFFSET = { x: 0, y: 24.5 };

  // 에고 이전 위치(ENU)와, 마지막 yaw(θ) 저장
  const prevEgoRef = useRef<{ e: number; n: number } | null>(null);
  const lastThetaRef = useRef<number>(0);
  const prevNeighborsRef = useRef(
    new Map<string | number, { e: number; n: number; theta: number }>(),
  );

  useEffect(() => {
    if (!current) return;

    const { ego, neighbors = [] } = current.payload;

    // 위경도 → CARLA 원본 XY 좌표로 역변환
    const { x: carlaX, y: carlaY } = latLonToCarlaXY(ego.pose.latitude, ego.pose.longitude);

    // 에고 진행방향(yaw) 추정 (첫 프레임은 스킵)
    // θ 정의: atan2(ΔX, ΔY) → CARLA 좌표계 기준
    let theta = lastThetaRef.current; // 기본: 직전 값 유지

    if (prevEgoRef.current) {
      const dX = carlaX - prevEgoRef.current.e; // ΔX
      const dY = carlaY - prevEgoRef.current.n; // ΔY
      // 너무 작은 이동은 노이즈로 간주(임계값 0.3m)
      if (Math.hypot(dX, dY) > 0.3) {
        // 원래 CARLA 좌표계 기준으로 theta 계산
        theta = Math.atan2(dX, dY); // 북쪽=0°, 동쪽=+90°
      }
    } else {
      prevEgoRef.current = { e: carlaX, n: carlaY };
      // 첫 프레임은 헤딩만 확보하고 렌더 스킵 (깜빡임 방지)

      return;
    }

    prevEgoRef.current = { e: carlaX, n: carlaY };
    lastThetaRef.current = theta;

    // 내 차량의 월드 좌표 업데이트
    setEgoWorldPos({ e: carlaX, n: carlaY, theta });

    const nbsScene = neighbors.map((nb) => {
      const { x: carlaX, y: carlaY } = latLonToCarlaXY(nb.pose.latitude, nb.pose.longitude);

      // 이전 위치와 θ 가져오기
      const prev = prevNeighborsRef.current.get(nb.userId);
      let theta = 0;

      if (prev) {
        const dX = carlaX - prev.e;
        const dY = carlaY - prev.n;
        if (Math.hypot(dX, dY) > 0.3) {
          theta = Math.atan2(dX, dY); // 원래 CARLA 좌표계 기준
        } else {
          theta = prev.theta ?? 0;
        }
      }

      // 이번 프레임 위치와 θ 저장
      prevNeighborsRef.current.set(nb.userId, { e: carlaX, n: carlaY, theta });

      return {
        userId: nb.userId,
        sx: carlaX,
        sz: carlaY,
        theta,
        character: nb.character as CharacterKey,
      };
    });

    // 내 차량은 항상 (0, 0)에 고정
    setScenePos({ ego: { sx: 0, sz: 0 }, nbs: nbsScene });

    console.warn('=== 최종 Scene 위치 ===', {
      EgoWorld위치: {
        X: carlaX.toFixed(2),
        Y: carlaY.toFixed(2),
        각도: ((theta * 180) / Math.PI).toFixed(1) + '°',
      },
      Neighbors개수: nbsScene.length,
      ThreeJS스케일: ROAD_SCALE,
    });
  }, [current]);

  if (!scenePos) return null;

  return (
    <group>
      {/* == 카메라 == */}
      <ChaseCam
        getEgo={() => ({
          sx: (egoWorldPos.e - VEHICLE_CENTER_OFFSET.x) * ROAD_SCALE + 1.05,
          sz: (egoWorldPos.n - VEHICLE_CENTER_OFFSET.y) * ROAD_SCALE - 0.65,
          theta: egoWorldPos.theta,
        })}
        back={2}
        height={1}
        lerp={0.1}
      />

      {/* == 유저 차량 == */}
      <group
        position={[
          (egoWorldPos.e - VEHICLE_CENTER_OFFSET.x) * ROAD_SCALE + 1.05,
          0,
          (egoWorldPos.n - VEHICLE_CENTER_OFFSET.y) * ROAD_SCALE - 0.65,
        ]}
        rotation={[0, egoWorldPos.theta + Math.PI, 0]}
      >
        <SimulationCar variant="ego" />
      </group>

      {/* == 주변 차량 == */}
      {scenePos.nbs.map((nb) => (
        <group
          key={nb.userId}
          position={[
            (nb.sx - VEHICLE_CENTER_OFFSET.x) * ROAD_SCALE + 1.05,
            0,
            (nb.sz - VEHICLE_CENTER_OFFSET.y) * ROAD_SCALE - 0.65,
          ]}
          rotation={[0, nb.theta + Math.PI, 0]}
        >
          <SimulationCar variant="neighbor" />
          <Html position={[0, 0.17, 0]} center distanceFactor={8} transform sprite>
            <Character>
              <CharacterImg src={CHARACTER_IMG[nb.character]} alt={nb.character} />
            </Character>
          </Html>
        </group>
      ))}
    </group>
  );
}
