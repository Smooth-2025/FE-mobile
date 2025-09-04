import { useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Html, Grid } from '@react-three/drei';
import * as THREE from 'three';
import { useSelector } from 'react-redux';
import { selectCurrentDrivingData } from '@/store/slices/drivingSlice';
import { theme } from '@/styles/theme';
import lion from '@/assets/images/characters/lion.png';
import dolphin from '@/assets/images/characters/dolphin.png';
import cat from '@/assets/images/characters/cat.png';
import meerkat from '@/assets/images/characters/meerkat.png';
import SimulationCar from '@/components/simulation/SimulationCar';
import {
  DUMI,
  meters_per_lat_degree,
  meters_per_lon_degree,
  origin_latitude,
  origin_longitude,
} from '@/components/simulation/mock/dumiData';
import useDumiPlayback from '@/components/simulation/mock/useDumiPlayback';
import { calculateLaneBoundaries } from '@/utils/laneBoundaryUtils';
import { sampleRoadGeometry } from '@/components/simulation/GeometrySampler';
import { ErrorBoundary } from '@/components/simulation/ErrorBoundary';
import * as Styled from './XodrGround3D.styles';
import type { OpenDriveData, LaneBoundaryData } from './types';

interface XodrGround3DProps {
  openDriveData?: OpenDriveData;
  laneBoundaryData?: LaneBoundaryData;
  showGrid?: boolean;
  width?: string | number;
  height?: string | number;
  roadLineWidth?: number;
  laneLineWidth?: number;
  samplingResolution?: number;
  showRoadLines?: boolean;
  showLaneLines?: boolean;
}

interface RoadLinesProps {
  openDriveData: OpenDriveData;
  lineWidth?: number;
  samplingResolution?: number;
}

interface LaneLinesProps {
  openDriveData: OpenDriveData;
  lineWidth?: number;
  samplingResolution?: number;
}

const LANE_COLORS = {
  none: '#FFFF00', // Center line - yellow
  driving: '#FFFFFF', // Driving lane - white
  shoulder: '#FF0000', // Shoulder - red
  sidewalk: '#808080', // Sidewalk - gray
  border: '#FFFFFF', // Border - white
  restricted: '#FFFF00', // Restricted - yellow
  parking: '#808080', // Parking - gray
  median: '#FFFF00', // Median - yellow
  biking: '#00FF00', // Biking - green
  stop: '#FF0000', // Stop - red
  entry: '#00FF00', // Entry - green
  exit: '#FF0000', // Exit - red
  offRamp: '#FF0000', // Off ramp - red
  onRamp: '#00FF00', // On ramp - green
} as const;

function getLaneColor(laneType: string, laneId: number): string {
  if (laneId === 0) {
    return LANE_COLORS.none;
  }

  const color = LANE_COLORS[laneType as keyof typeof LANE_COLORS];
  return color || LANE_COLORS.driving;
}

function RoadLines({
  openDriveData,
  lineWidth = 0.2,
  samplingResolution = 1,
}: RoadLinesProps): React.JSX.Element {
  const roadGeometry = useMemo(() => {
    try {
      if (!openDriveData?.road || openDriveData.road.length === 0) {
        return null;
      }

      const allPoints: THREE.Vector3[] = [];
      const allIndices: number[] = [];
      let currentIndex = 0;

      for (const road of openDriveData.road) {
        if (!road.planView?.geometry || road.planView.geometry.length === 0) {
          continue;
        }

        try {
          const sampledPoints = sampleRoadGeometry(road.planView.geometry, samplingResolution);

          if (sampledPoints.length < 2) {
            continue;
          }

          const roadPoints: THREE.Vector3[] = [];
          for (const point of sampledPoints) {
            if (isFinite(point.x) && isFinite(point.y)) {
              roadPoints.push(new THREE.Vector3(point.x, 0, -point.y));
            }
          }

          if (roadPoints.length < 2) {
            continue;
          }

          allPoints.push(...roadPoints);

          for (let i = 0; i < roadPoints.length - 1; i++) {
            allIndices.push(currentIndex + i, currentIndex + i + 1);
          }

          currentIndex += roadPoints.length;
        } catch (error) {
          console.warn(`Failed to sample geometry for road ${road.id}:`, error);
          continue;
        }
      }

      if (allPoints.length === 0) {
        return null;
      }

      const geometry = new THREE.BufferGeometry();

      const positions = new Float32Array(allPoints.length * 3);
      for (let i = 0; i < allPoints.length; i++) {
        positions[i * 3] = allPoints[i].x;
        positions[i * 3 + 1] = allPoints[i].y;
        positions[i * 3 + 2] = allPoints[i].z;
      }
      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

      geometry.setIndex(allIndices);

      return geometry;
    } catch (error) {
      console.error('Failed to create road geometry:', error);
      return null;
    }
  }, [openDriveData, samplingResolution]);

  if (!roadGeometry) {
    return <></>;
  }

  return (
    <lineSegments geometry={roadGeometry}>
      <lineBasicMaterial color="#ffffff" linewidth={lineWidth} transparent opacity={0.9} />
    </lineSegments>
  );
}

function LaneLines({
  openDriveData,
  lineWidth = 0.15,
  samplingResolution = 1,
}: LaneLinesProps): React.JSX.Element {
  const laneGeometries = useMemo(() => {
    try {
      if (!openDriveData?.road || openDriveData.road.length === 0) {
        return {};
      }

      const geometriesByColor: { [color: string]: THREE.Vector3[] } = {};
      const indicesByColor: { [color: string]: number[] } = {};
      const indexCountByColor: { [color: string]: number } = {};

      for (const road of openDriveData.road) {
        if (!road.planView?.geometry || road.planView.geometry.length === 0) {
          continue;
        }

        try {
          const centerLine = sampleRoadGeometry(road.planView.geometry, samplingResolution);

          if (centerLine.length < 2) {
            continue;
          }

          const laneBoundaryData = calculateLaneBoundaries(road, centerLine);

          for (const [laneIdKey, boundaryPoints] of Object.entries(laneBoundaryData.boundaries)) {
            if (boundaryPoints.length < 2) {
              continue;
            }

            let laneType = 'driving';
            let laneId = 0;

            for (const section of road.lanes.laneSection) {
              const allLanes = [
                ...(section.left || []),
                ...(section.center || []),
                ...(section.right || []),
              ];

              for (const lane of allLanes) {
                if (`${road.id}_${lane.id}` === laneIdKey) {
                  laneType = lane.type;
                  laneId = lane.id;
                  break;
                }
              }
            }

            const color = getLaneColor(laneType, laneId);

            if (!geometriesByColor[color]) {
              geometriesByColor[color] = [];
              indicesByColor[color] = [];
              indexCountByColor[color] = 0;
            }

            const lanePoints: THREE.Vector3[] = [];
            for (const point of boundaryPoints) {
              if (isFinite(point.x) && isFinite(point.y)) {
                lanePoints.push(new THREE.Vector3(point.x, 0.1, -point.y));
              }
            }

            if (lanePoints.length < 2) {
              continue;
            }

            geometriesByColor[color].push(...lanePoints);

            const startIndex = indexCountByColor[color];
            for (let i = 0; i < lanePoints.length - 1; i++) {
              indicesByColor[color].push(startIndex + i, startIndex + i + 1);
            }

            indexCountByColor[color] += lanePoints.length;
          }
        } catch (error) {
          console.warn(`Failed to calculate lane boundaries for road ${road.id}:`, error);
          continue;
        }
      }

      const finalGeometries: { [color: string]: THREE.BufferGeometry } = {};

      for (const [color, points] of Object.entries(geometriesByColor)) {
        if (points.length === 0) continue;

        try {
          const geometry = new THREE.BufferGeometry();

          const positions = new Float32Array(points.length * 3);
          for (let i = 0; i < points.length; i++) {
            positions[i * 3] = points[i].x;
            positions[i * 3 + 1] = points[i].y;
            positions[i * 3 + 2] = points[i].z;
          }
          geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

          geometry.setIndex(indicesByColor[color]);

          finalGeometries[color] = geometry;
        } catch (error) {
          console.warn(`Failed to create geometry for color ${color}:`, error);
          continue;
        }
      }

      return finalGeometries;
    } catch (error) {
      console.error('Failed to create lane geometries:', error);
      return {};
    }
  }, [openDriveData, samplingResolution]);

  return (
    <>
      {Object.entries(laneGeometries).map(([color, geometry]) => (
        <lineSegments key={color} geometry={geometry}>
          <lineBasicMaterial color={color} linewidth={lineWidth} transparent opacity={0.8} />
        </lineSegments>
      ))}
    </>
  );
}

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

// 위경도 → ENU 변환
function latLonToENU(lat: number, lon: number) {
  const east = (lon - origin_longitude) * meters_per_lon_degree;
  const north = (lat - origin_latitude) * meters_per_lat_degree;
  return { east, north };
}

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
      // 첫 프레임은 튕김 방지 위해 즉시 세팅
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

export function XodrGround3D({
  openDriveData,
  laneBoundaryData: _laneBoundaryData,
  showGrid = true,
  width = '100%',
  height = '100vh',
  roadLineWidth = 0.2,
  laneLineWidth = 0.15,
  samplingResolution = 1,
  showRoadLines = true,
  showLaneLines = true,
}: XodrGround3DProps): React.JSX.Element {
  useDumiPlayback({ data: DUMI, tickMs: 1000, autostart: true, loop: false });

  const current = useSelector(selectCurrentDrivingData);
  const [scenePos, setScenePos] = useState<ScenePos | null>(null);
  // 차량 중심 좌표계를 위한 상태 추가
  const [egoWorldPos, setEgoWorldPos] = useState<{ e: number; n: number; theta: number }>({
    e: 0,
    n: 0,
    theta: 0,
  });

  // 에고 이전 위치(ENU)와, 마지막 yaw(θ) 저장
  const prevEgoRef = useRef<{ e: number; n: number } | null>(null);
  const lastThetaRef = useRef<number>(0);
  const prevNeighborsRef = useRef(
    new Map<string | number, { e: number; n: number; theta: number }>(),
  );

  useEffect(() => {
    if (!current) return;

    const { ego, neighbors = [] } = current.payload;

    // 위경도 → ENU 변환
    const { east: e, north: n } = latLonToENU(ego.pose.latitude, ego.pose.longitude);

    //에고 진행방향(yaw) 추정 (첫 프레임은 스킵)
    //θ 정의: atan2(ΔE, ΔN) → 북=0°, 동=+90° (시계방향 +)
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

    // 내 차량의 월드 좌표 업데이트 (도로 이동을 위해)
    setEgoWorldPos({ e, n, theta });

    const nbsScene = neighbors.map((nb) => {
      const { east: e, north: n } = latLonToENU(nb.pose.latitude, nb.pose.longitude);

      // 이전 위치와 θ 가져오기
      const prev = prevNeighborsRef.current.get(nb.userId);
      let theta = 0;

      if (prev) {
        const dE = e - prev.e;
        const dN = n - prev.n;
        if (Math.hypot(dE, dN) > 0.3) {
          theta = Math.atan2(dE, dN);
        } else {
          theta = prev.theta ?? 0;
        }
      }

      // 이번 프레임 위치와 θ 저장
      prevNeighborsRef.current.set(nb.userId, { e: e, n: n, theta });
      return {
        userId: nb.userId,
        sx: e,
        sz: n,
        theta,
        character: nb.character as CharacterKey,
      };
    });

    // 내 차량은 항상 (0, 0)에 고정
    setScenePos({ ego: { sx: 0, sz: 0 }, nbs: nbsScene });
  }, [current]);

  return (
    <Canvas
      camera={{
        position: [0, 50, 50],
        fov: 60,
        near: 0.1,
        far: 1000,
      }}
      style={{
        width: typeof width === 'number' ? `${width}px` : width,
        height: typeof height === 'number' ? `${height}px` : height,
      }}
    >
      <ambientLight intensity={0.6} />

      <directionalLight
        position={[10, 10, 5]}
        intensity={1}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      {/*  == 카메라 == */}
      <ChaseCam
        getEgo={() => ({ sx: egoWorldPos.e, sz: egoWorldPos.n, theta: egoWorldPos.theta })}
      />
      {/* == 유저 차량 == */}
      {scenePos && (
        <group position={[egoWorldPos.e, 0, egoWorldPos.n]} rotation={[0, egoWorldPos.theta, 0]}>
          <SimulationCar variant="ego" yawFix={Math.PI} />
          <primitive object={new THREE.AxesHelper(3)} />
        </group>
      )}

      {/* == 주변 차량  == */}
      {scenePos?.nbs.map((nb) => (
        <group key={nb.userId} position={[nb.sx, 0, nb.sz]} rotation={[0, egoWorldPos.theta, 0]}>
          <SimulationCar variant="neighbor" yawFix={Math.PI} />
          <Html position={[0, 1.0, 0]} center distanceFactor={10} transform>
            <Styled.Character>
              <Styled.CharacterImg src={CHARACTER_IMG[nb.character]} alt={nb.character} />
            </Styled.Character>
          </Html>
        </group>
      ))}

      {/* == 그리드 박스 == */}
      {showGrid && (
        <Grid
          infiniteGrid
          cellSize={10}
          cellThickness={0.5}
          cellColor="#6f6f6f"
          sectionSize={100}
          sectionThickness={1}
          sectionColor="#9d4b4b"
          fadeDistance={400}
          fadeStrength={1}
        />
      )}

      <OrbitControls
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        enableDamping={true}
        dampingFactor={0.05}
        minDistance={5}
        maxDistance={500}
        maxPolarAngle={Math.PI / 2}
      />

      {openDriveData && showRoadLines && (
        <ErrorBoundary fallbackMessage="도로 라인 렌더링에 실패했습니다">
          <RoadLines
            openDriveData={openDriveData}
            lineWidth={roadLineWidth}
            samplingResolution={samplingResolution}
          />
        </ErrorBoundary>
      )}

      {openDriveData && showLaneLines && (
        <ErrorBoundary fallbackMessage="차선 라인 렌더링에 실패했습니다">
          <LaneLines
            openDriveData={openDriveData}
            lineWidth={laneLineWidth}
            samplingResolution={samplingResolution}
          />
        </ErrorBoundary>
      )}

      {!openDriveData && (
        <mesh position={[0, 0.5, 0]}>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color={theme.colors.accent_orange} />
        </mesh>
      )}
    </Canvas>
  );
}
