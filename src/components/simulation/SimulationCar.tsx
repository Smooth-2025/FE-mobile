import { useGLTF, Clone } from '@react-three/drei';
import * as THREE from 'three';
import { useMemo, useEffect } from 'react';
import type { Group } from 'three';

type CarGLTF = { scene: Group };

type Props = {
  variant?: 'ego' | 'neighbor';
  yawFix?: number;
};

const S3_BASE_URL = import.meta.env.VITE_S3_BASE_URL;
const EGO_CAR_URL = `${S3_BASE_URL}/assets/models/egoCar.glb`;
const NEIGHBOR_CAR_URL = `${S3_BASE_URL}/assets/models/neighborsCar.glb`;

export default function SimulationCar({ variant = 'neighbor' }: Props) {
  const modelUrl = useMemo(() => (variant === 'ego' ? EGO_CAR_URL : NEIGHBOR_CAR_URL), [variant]);

  const { scene } = useGLTF(modelUrl) as CarGLTF;

  // 모델 크기 정규화 (도로 환경 스케일에 맞춤)
  const autoScale = useMemo(() => {
    const box = new THREE.Box3().setFromObject(scene);
    const size = box.getSize(new THREE.Vector3()).length();
    // 도로 환경이 0.1 스케일이므로 차량도 그에 맞게 축소
    const ROAD_SCALE = 0.1;
    // CARLA 좌표와 일치하도록 ADDITIONAL_SCALE 제거
    const TARGET_LENGTH = variant === 'ego' ? 5 * ROAD_SCALE : 4 * ROAD_SCALE;
    return size ? TARGET_LENGTH / size : ROAD_SCALE;
  }, [scene, variant]);

  // 머티리얼/그림자 보정 (1회)
  useEffect(() => {
    scene.traverse((obj) => {
      const mesh = obj as THREE.Mesh;
      if (!mesh.isMesh) return;
      mesh.castShadow = true;
      mesh.receiveShadow = false;
      const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
      mats.forEach((mm) => {
        const m = mm as THREE.MeshStandardMaterial;
        if (!m) return;
        m.side = THREE.DoubleSide;
        m.metalness = Math.min(0.6, m.metalness ?? 0.2);
        m.roughness = Math.max(0.2, m.roughness ?? 0.6);
      });
    });
  }, [scene]);

  return (
    <group scale={autoScale} rotation={[0, Math.PI, 0]}>
      <Clone object={scene} />
    </group>
  );
}

useGLTF.preload(EGO_CAR_URL);
useGLTF.preload(NEIGHBOR_CAR_URL);
