import { memo, Suspense, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Canvas } from '@react-three/fiber';
import { Environment } from '@react-three/drei';
import { selectCurrentDrivingData } from '@/store/slices/drivingSlice';
import SimulationGround from '@/components/driving/SimulationGround';

// 카메라
const CAMERA_POS: [number, number, number] = [0, 5, 10];
const CAMERA_FOV = 55;

function DrivingSimulation() {
  // 더미 프레임을 1초 간격으로 Redux에 업데이트
  // useDumiPlayback({ data: DUMI, tickMs: 1000, autostart: true, loop: false });

  const current = useSelector(selectCurrentDrivingData);

  useEffect(() => {
    if (current) {
      //current 로그 확인
    }
  }, [current]);

  return (
    <section style={{ width: '100%', height: '100vh' }}>
      <Canvas dpr={[1, 2]} shadows camera={{ position: CAMERA_POS, fov: CAMERA_FOV }}>
        <color attach="background" args={['rgba(42, 42, 42, 1)']} />
        <directionalLight position={[8, 12, 10]} intensity={1.1} castShadow />
        <ambientLight intensity={0.35} />

        <Suspense fallback={null}>
          <Environment preset="city" />
          <SimulationGround />

          {/* 내 차: 화면 중앙(원점), 전방은 -Z 가정 */}
          {/* {ego && (
            <group position={[0, 0, 0]} rotation={[0, 0, 0]}>
              <SimulationCar variant="ego" />
            </group>
          )} */}

          {/* 주변 차량: ego 기준 상대 좌표 → ego 헤딩 기준 회전 보정 */}
          {/* {ego &&
            toLocal &&
            neighbors.map((nb) => {
              const { latitude, longitude } = nb.pose;
              const { x, z } = toLocal(latitude, longitude); // 에고 기준 ENU→scene
              const { xLocal, zLocal } = worldToCarFrame(x, z, egoYaw); // 헤딩 기준 회전
              return (
                <group key={nb.userId} position={[xLocal, 0, zLocal]} rotation={[0, 0, 0]}>
                  <SimulationCar variant="neighbor" />
                </group>
              );
            })} */}
        </Suspense>
      </Canvas>
    </section>
  );
}

export default memo(DrivingSimulation);
