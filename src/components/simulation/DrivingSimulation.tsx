import { Canvas } from '@react-three/fiber';
import { Environment } from '@react-three/drei';
import { Suspense } from 'react';
import RoadEnvironment from './RoadEnvironment';
import VehicleManager from './VehicleManager';
// import useDumiPlayback from './mock/useDumiPlayback';
// import { DUMI } from './mock/dumiData';

const S3_BASE_URL = import.meta.env.VITE_S3_BASE_URL;
const MAP_URL = `${S3_BASE_URL}/assets/maps/Town10HD_Opt.xodr`;

export default function DrivingSimulation() {
  // useDumiPlayback({ data: DUMI, tickMs: 1000, autostart: true, loop: false });

  return (
    <div style={{ width: '100%', height: '100vh', background: '#868686' }}>
      <Canvas
        camera={{
          position: [100, 50, 50],
          fov: 60,
        }}
        shadows
      >
        <ambientLight intensity={0.4} />
        <directionalLight
          position={[10, 10, 5]}
          intensity={1}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />

        <Suspense fallback={null}>
          <RoadEnvironment mapUrl={MAP_URL} />
          <VehicleManager />
          <Environment preset="sunset" />
        </Suspense>

        {/* <OrbitControls
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          maxPolarAngle={Math.PI / 2}
        /> */}
      </Canvas>
    </div>
  );
}
