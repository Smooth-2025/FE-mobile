import { useGLTF, Clone } from '@react-three/drei';
import * as THREE from 'three';
import type { Group } from 'three';

type CarGLTF = { scene: Group };

const BASE = import.meta.env.BASE_URL || '/';
const CAR_URL = `${BASE}models/car.glb`;

export default function SimulationCar({
  scale = 30,
  yawFix = Math.PI,
}: {
  scale?: number;
  yawFix?: number;
}) {
  const { scene } = useGLTF(CAR_URL, true) as CarGLTF;

  // 머티리얼/그림자 보정
  scene.traverse((obj) => {
    const mesh = obj as THREE.Mesh;
    if (!mesh.isMesh) return;
    mesh.castShadow = true;
    mesh.receiveShadow = false;
    const mat = mesh.material as THREE.MeshStandardMaterial | THREE.MeshStandardMaterial[];
    const tweak = (m: THREE.MeshStandardMaterial) => {
      m.side = THREE.DoubleSide;
      m.metalness = Math.min(0.6, m.metalness ?? 0.2);
      m.roughness = Math.max(0.2, m.roughness ?? 0.6);
    };
    if (Array.isArray(mat)) mat.forEach(tweak);
    else if (mat) tweak(mat);
  });
  return (
    <group scale={scale} rotation-y={yawFix}>
      <Clone object={scene} />
    </group>
  );
}

useGLTF.preload(CAR_URL);
