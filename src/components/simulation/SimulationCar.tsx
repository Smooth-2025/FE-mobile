import { useGLTF, Clone } from '@react-three/drei';
import * as THREE from 'three';
import { useMemo, useEffect } from 'react';
import type { Group } from 'three';

type CarGLTF = { scene: Group };

type Props = {
  variant?: 'ego' | 'neighbor';
  yawFix?: number;
};

const BASE = import.meta.env.BASE_URL || '/';
const EGO_CAR_URL = `${BASE}models/egoCar.glb`;
const NEIGHBOR_CAR_URL = `${BASE}models/neighborsCar.glb`;

export default function SimulationCar({ variant = 'neighbor' }: Props) {
  const modelUrl = useMemo(() => (variant === 'ego' ? EGO_CAR_URL : NEIGHBOR_CAR_URL), [variant]);

  const { scene } = useGLTF(modelUrl) as CarGLTF;

  // 모델 크기 정규화
  const autoScale = useMemo(() => {
    const box = new THREE.Box3().setFromObject(scene);
    const size = box.getSize(new THREE.Vector3()).length();
    const TARGET_LENGTH = variant === 'ego' ? 3.0 : 2.4;
    return size ? TARGET_LENGTH / size : 1;
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
    <group scale={autoScale} rotation={[0, 0, 0]}>
      <Clone object={scene} />
    </group>
  );
}

//깜빡임 최소화
useGLTF.preload(EGO_CAR_URL);
useGLTF.preload(NEIGHBOR_CAR_URL);
