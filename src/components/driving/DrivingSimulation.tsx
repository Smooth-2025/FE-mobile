import { Suspense, useState, useEffect, useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, Html } from '@react-three/drei';
import {
  createLatLonToLocalMeters,
  createHeadingEstimator,
  enuRelativeToScene,
} from '@/components/driving/geo';
import { DUMI, type DrivingFrame } from '@/components/driving/dumiData';
import SimulationGround from '@/components/driving/SimulationGround';
import SimulationCar from '@/components/driving/SimulationCar';
import * as styled from '@/components/driving/DrivingSimulation.styles';
import lion from '@/assets/images/characters/lion.png';
import dolphin from '@/assets/images/characters/dolphin.png';
import cat from '@/assets/images/characters/cat.png';
import meerkat from '@/assets/images/characters/meerkat.png';
import DumiHUD from './DumiHUD';
import DrivingLane from './DrivingLane';

// == 화면 스케일: 실제 m 단위를 화면에 매핑할 때의 배율 ==
//  - forward: 앞/뒤(북쪽) 축 배율 (three의 -Z)
//  - lateral: 좌/우(동쪽) 축 배율 (three의 +X)
const SCALE = { forward: 1, lateral: 1 };

// == 카메라 기본값: 카메라 위치 시점 설정(위에서 내려다 보는 시점) ==
const CAMERA_POS: [number, number, number] = [0, 5, 10];
const CAMERA_FOV = 55;

//== 성향별 아이콘 이미지 매핑 (사자,돌고래,미어캣,고양이)==
const CHARACTER_IMG: Record<string, string> = {
  lion,
  dolphin,
  meerkat,
  cat,
};

// == 속도 보정 상수(seconds) ==
const SPEED_SMOOTH_TAU = 0.15; //

export default function DrivingSimulation() {
  // 재생 순서 보장하기 위해 timestamp 기준 정렬
  const frames: DrivingFrame[] = useMemo(
    () => DUMI.slice().sort((a, b) => a.timestamp.localeCompare(b.timestamp)),
    [],
  );

  const len = frames.length;
  const idxRef = useRef(0);
  const [cur, setCur] = useState<DrivingFrame | null>(len ? frames[0] : null);

  //1초 간격으로 이후 프레임 진행
  useEffect(() => {
    if (len === 0) return;
    const id = window.setInterval(() => {
      idxRef.current = Math.min(idxRef.current + 1, len - 1);
      setCur(frames[idxRef.current]);
    }, 1000);
    return () => window.clearInterval(id);
  }, [len, frames]);

  // == 위경도→로컬(m) 변환: 첫 프레임의 에고 위치를 원점으로 사용 ==
  const toLocal = useMemo(() => {
    if (!frames.length) return (_lat: number, _lon: number) => ({ x: 0, y: 0 });
    const first = frames[0].ego.pose;
    return createLatLonToLocalMeters(first.latitude, first.longitude);
  }, [frames]);

  // == 헤딩(yaw)추정: 위치 변화량 기반으로 북을 기준 시계방향 각도 반환 ==
  const estimateYaw = useMemo(() => createHeadingEstimator(0.25), []);

  //== 현재 프레임을 로컬 좌표/헤딩으로 변환해 렌더링에 필요한 최소 데이터로 정제 ==
  const processed = useMemo(() => {
    if (!cur) return null;
    const ts = Date.parse(cur.timestamp);

    const egoLocal = toLocal(cur.ego.pose.latitude, cur.ego.pose.longitude); // {x,y} ~= {east,north}
    // three에서는 시계방향 회전을 음수로 적용하므로 렌더 시 -yaw를 사용함
    const egoYawAbs = estimateYaw(cur.ego.userId, egoLocal.x, egoLocal.y, ts); // 북(0rad) 기준 시계방향(+동쪽)

    const nbs = (cur.neighbors ?? []).map((nb) => {
      const p = toLocal(nb.pose.latitude, nb.pose.longitude);
      const yawAbs = estimateYaw(nb.userId, p.x, p.y, ts);
      return { ...nb, local: { east: p.x, north: p.y }, yawAbs };
    });

    return { ego: { east: egoLocal.x, north: egoLocal.y, yawAbs: egoYawAbs }, nbs };
  }, [cur, toLocal, estimateYaw]);

  //속도 표시에 사용할 상태: 목표 속도(샘플), 표시 속도(보간), 마지막 샘플
  const speedTargetRef = useRef(0); // m/s, 1초마다 업데이트되는 목표 속도
  const speedDisplayRef = useRef(0); // m/s, 매 프레임 보간된 표시 속도
  const lastSampleRef = useRef<{ t: number; x: number; y: number } | null>(null);

  //연속 샘플로부터 속도(m/s) 계산. 정지/미동, 동일 타임스탬프는 0으로 처리
  useEffect(() => {
    if (!cur) return;
    const t = Date.parse(cur.timestamp) / 1000; // sec
    const { x, y } = toLocal(cur.ego.pose.latitude, cur.ego.pose.longitude);

    if (!lastSampleRef.current) {
      lastSampleRef.current = { t, x, y };
      speedTargetRef.current = 0;
      return;
    }

    const dt = t - lastSampleRef.current.t;
    const dx = x - lastSampleRef.current.x;
    const dy = y - lastSampleRef.current.y;

    if (dt < 1e-3 || dx * dx + dy * dy < 1e-6) {
      speedTargetRef.current = 0; // 정지/미동 취급
    } else {
      const v = Math.sqrt(dx * dx + dy * dy) / dt; // m/s
      speedTargetRef.current = v; // 목표 속도 갱신
    }

    lastSampleRef.current = { t, x, y };
  }, [cur, toLocal]);

  //시 속도를 목표 속도로 지수 보간해 튀는 값을 완화
  function SpeedLerper() {
    useFrame((_, delta) => {
      const target = speedTargetRef.current;
      const current = speedDisplayRef.current;
      const alpha = 1 - Math.exp(-delta / SPEED_SMOOTH_TAU);
      speedDisplayRef.current = current + (target - current) * alpha;
    });
    return null;
  }

  if (!processed) return null;
  const { ego, nbs } = processed;

  return (
    <div style={{ width: '100%', height: '100vh' }}>
      <Canvas dpr={[1, 2]} shadows camera={{ position: CAMERA_POS, fov: CAMERA_FOV }}>
        <color attach="background" args={['rgba(42, 42, 42, 1)']} />
        <directionalLight position={[8, 12, 10]} intensity={1.1} castShadow />
        <ambientLight intensity={0.35} />

        <Suspense fallback={null}>
          {/* == 환경맵(조명/배경) ==*/}
          <Environment preset="city" />
          {/* == 바닥 그리드 ==*/}
          <SimulationGround />

          {/* == 속도 보간기 == */}
          <SpeedLerper />
          {/* == 차선 가이드 ==*/}
          <DrivingLane getSpeed={() => speedDisplayRef.current} />

          {/* == 유저 차량: -yaw 회전으로 시계방향 헤딩 보정 ==*/}
          <group position={[0, 0, 0]} rotation={[0, -ego.yawAbs, 0]}>
            <SimulationCar variant="ego" />
          </group>

          {/* == 주변 차량: 에고 기준 상대 위치로 배치 + 성향 아이콘 라벨 == */}
          {nbs.map((nb) => {
            const rel = enuRelativeToScene(
              { east: ego.east, north: ego.north },
              { east: nb.local.east, north: nb.local.north },
              SCALE,
            );
            return (
              <group key={nb.userId} position={[rel.sx, 0, rel.sz]} rotation={[0, -nb.yawAbs, 0]}>
                <SimulationCar variant="neighbor" />
                <Html position={[0, 1.0, 0]} center distanceFactor={10} transform>
                  <styled.Character>
                    <styled.CharacterImg src={CHARACTER_IMG[nb.character]} alt={nb.character} />
                  </styled.Character>
                </Html>
              </group>
            );
          })}
        </Suspense>
      </Canvas>

      {/* == HUD: 현재 프레임/에고/이웃/시각 정보 표시 == */}
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
