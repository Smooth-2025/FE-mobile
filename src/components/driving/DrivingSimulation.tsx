import { memo, Suspense, useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { Environment, Html } from '@react-three/drei';
import { selectCurrentDrivingData } from '@/store/slices/drivingSlice';
import * as styled from '@/components/driving/DrivingSimulation.styles';
import lion from '@/assets/images/characters/lion.png';
import dolphin from '@/assets/images/characters/dolphin.png';
import cat from '@/assets/images/characters/cat.png';
import meerkat from '@/assets/images/characters/meerkat.png';
import {
  origin_latitude,
  origin_longitude,
  meters_per_lat_degree,
  meters_per_lon_degree,
} from '@/components/driving/dumiData';
import SimulationCar from '@/components/driving/SimulationCar';
import SimulationGround from '@/components/driving/SimulationGround';
// import useDumiPlayback from '@/components/driving/useDumiPlayback';

const CHARACTER_IMG = {
  lion,
  dolphin,
  meerkat,
  cat,
} as const;

type CharacterKey = keyof typeof CHARACTER_IMG;

type ScenePos = {
  ego: { sx: number; sz: number };
  nbs: Array<{
    userId: number | string;
    sx: number;
    sz: number;
    character: CharacterKey;
  }>;
};

// 위경도 → ENU 변환
function latLonToENU(lat: number, lon: number) {
  const east = (lon - origin_longitude) * meters_per_lon_degree;
  const north = (lat - origin_latitude) * meters_per_lat_degree;
  return { east, north };
}
//  +X=오른쪽, +Y=위, "앞"은 -Z
function enuToScene(east: number, north: number) {
  return { sx: east, sz: -north };
}

// == 추적 카메라: 항상 에고 뒤(+Z)에서 에고 확인 ==
function ChaseCam({
  getEgo,
  back = 12,
  height = 5,
  lerp = 0.15,
}: {
  getEgo: () => { sx: number; sz: number } | null;
  back?: number;
  height?: number;
  lerp?: number;
}) {
  const { camera } = useThree();
  const pos = new THREE.Vector3();
  const target = new THREE.Vector3();
  useFrame((_, dt) => {
    const ego = getEgo();
    if (!ego) return;
    target.set(ego.sx, 0, ego.sz);
    pos.set(ego.sx, height, ego.sz + back);
    const a = 1 - Math.exp(-dt / lerp);
    camera.position.lerp(pos, a);
    camera.lookAt(target);
  });
  return null;
}

function DrivingSimulation() {
  // 더미 스토어 업데이트 훅
  //useDumiPlayback({ data: DUMI, tickMs: 1000, autostart: true, loop: false });

  const current = useSelector(selectCurrentDrivingData);
  const [scenePos, setScenePos] = useState<ScenePos | null>(null);
  const [headingDeg, setHeadingDeg] = useState<number>(0);

  // 에고 이전 위치(ENU)와, 마지막 yaw(θ) 저장
  const prevEgoRef = useRef<{ e: number; n: number } | null>(null);
  const lastThetaRef = useRef<number>(0);

  useEffect(() => {
    if (!current) return;

    const { ego, neighbors = [] } = current.payload;

    // 위경도 → ENU 변환
    const { east: e, north: n } = latLonToENU(ego.pose.latitude, ego.pose.longitude);

    // 2) 에고 진행방향(yaw) 추정 (첫 프레임은 스킵)
    //    θ 정의: atan2(ΔE, ΔN) → 북=0°, 동=+90° (시계방향 +)
    let theta = lastThetaRef.current; // 기본: 직전 값 유지
    if (prevEgoRef.current) {
      const dE = e - prevEgoRef.current.e;
      const dN = n - prevEgoRef.current.n;
      // 너무 작은 이동은 노이즈로 간주(임계값 0.3m)
      if (Math.hypot(dE, dN) > 0.3) {
        theta = Math.atan2(dE, dN);
      }
    } else {
      prevEgoRef.current = { e, n };
      // 첫 프레임은 헤딩만 확보하고 렌더 스킵 (깜빡임 방지)
      return;
    }
    prevEgoRef.current = { e, n };
    lastThetaRef.current = theta;

    // 표시용 각도(도): 북=0°, 동=+90°\n(-180~+180 범위)
    const deg = THREE.MathUtils.radToDeg(theta);
    setHeadingDeg(Math.round(deg));

    const c = Math.cos(theta),
      s = Math.sin(theta);

    const nbsScene = neighbors.map((nb) => {
      const nbENU = latLonToENU(nb.pose.latitude, nb.pose.longitude);
      const relE = nbENU.east - e;
      const relN = nbENU.north - n;

      const right = relE * c - relN * s;
      const fwd = relE * s + relN * c;

      const rightUI = -right; //좌/우 변환
      const { sx } = enuToScene(rightUI, 0);
      const { sz } = enuToScene(0, fwd);

      return {
        userId: nb.userId,
        sx,
        sz,
        character: nb.character as CharacterKey,
      };
    });
    setScenePos({ ego: { sx: 0, sz: 0 }, nbs: nbsScene });
  }, [current]);

  return (
    <section style={{ width: '100%', height: '100dvh' }}>
      <Canvas dpr={[1, 2]} shadows camera={{ position: [0, 6, 14], fov: 55 }}>
        <color attach="background" args={['#2a2a2a']} />
        <directionalLight position={[8, 12, 10]} intensity={1.1} castShadow />
        <ambientLight intensity={0.35} />

        <Suspense fallback={null}>
          <Environment preset="city" />
          <SimulationGround />

          {scenePos && <ChaseCam getEgo={() => scenePos.ego} back={12} height={5} />}

          {/* == 유저 차량 == */}
          {scenePos && (
            <group position={[scenePos.ego.sx, 0, scenePos.ego.sz]}>
              <SimulationCar variant="ego" yawFix={Math.PI} />
              {/* 진행방향 표시 */}
              <primitive object={new THREE.AxesHelper(3)} />
            </group>
          )}

          {/* == 주변 차량  == */}
          {scenePos?.nbs.map((nb) => (
            <group key={nb.userId} position={[nb.sx, 0, nb.sz]}>
              <SimulationCar variant="neighbor" yawFix={Math.PI} />
              <Html position={[0, 1.0, 0]} center distanceFactor={10} transform>
                <styled.Character>
                  <styled.CharacterImg src={CHARACTER_IMG[nb.character]} alt={nb.character} />
                </styled.Character>
              </Html>
            </group>
          ))}
        </Suspense>
      </Canvas>
      {/* == heading == */}
      <div
        style={{
          position: 'absolute',
          top: 10,
          left: 10,
          color: 'white',
          background: 'rgba(0,0,0,0.6)',
          padding: '4px 8px',
          borderRadius: 4,
          fontSize: 14,
          fontFamily: 'monospace',
        }}
      >
        Heading: {headingDeg}°
      </div>
    </section>
  );
}

export default memo(DrivingSimulation);
