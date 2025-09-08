import React, { useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Grid, Text } from '@react-three/drei';
import * as THREE from 'three';
import { validateOpenDriveData, type UserFriendlyError } from './ErrorHandling';
import type { OpenDriveData, OpenDriveGeometry, Road, Point2D } from './types';

interface FallbackRendererProps {
  openDriveData?: OpenDriveData;
  errors?: UserFriendlyError[];
  warnings?: string[];
  width?: string | number;
  height?: string | number;
  showGrid?: boolean;
  showErrorInfo?: boolean;
}

//지오메트리 샘플링 : 오류 발생시 최소한의 점들을 반환
function safeSampleGeometry(geometry: OpenDriveGeometry): Point2D[] {
  try {
    if (
      typeof geometry.x !== 'number' ||
      typeof geometry.y !== 'number' ||
      typeof geometry.length !== 'number' ||
      geometry.length <= 0
    ) {
      return [];
    }

    const points: Point2D[] = [];
    const numPoints = Math.max(2, Math.min(10, Math.ceil(geometry.length)));

    switch (geometry.type) {
      case 'line': {
        const hdg = typeof geometry.hdg === 'number' ? geometry.hdg : 0;
        const cos_hdg = Math.cos(hdg);
        const sin_hdg = Math.sin(hdg);

        for (let i = 0; i < numPoints; i++) {
          const t = i / (numPoints - 1);
          const distance = t * geometry.length;

          points.push({
            x: geometry.x + distance * cos_hdg,
            y: geometry.y + distance * sin_hdg,
          });
        }
        break;
      }

      case 'arc': {
        if (typeof geometry.curvature !== 'number' || geometry.curvature === 0) {
          // 곡률이 잘못된 경우 직선 처리
          return safeSampleGeometry({ ...geometry, type: 'line' });
        }

        const radius = Math.abs(1 / geometry.curvature);
        const hdg = typeof geometry.hdg === 'number' ? geometry.hdg : 0;

        // 중심점 계산
        const centerOffsetAngle = hdg + (geometry.curvature > 0 ? Math.PI / 2 : -Math.PI / 2);
        const centerX = geometry.x + radius * Math.cos(centerOffsetAngle);
        const centerY = geometry.y + radius * Math.sin(centerOffsetAngle);

        const startAngle = Math.atan2(geometry.y - centerY, geometry.x - centerX);
        const totalAngle = geometry.length / radius;

        for (let i = 0; i < numPoints; i++) {
          const t = i / (numPoints - 1);
          const currentAngle = startAngle + (geometry.curvature > 0 ? totalAngle : -totalAngle) * t;

          points.push({
            x: centerX + radius * Math.cos(currentAngle),
            y: centerY + radius * Math.sin(currentAngle),
          });
        }
        break;
      }

      case 'spiral': {
        // 나선의 경우 복잡한 계산이 실패할 수 있으므로 직선으로 근사
        return safeSampleGeometry({ ...geometry, type: 'line' });
      }

      default: {
        // 알 수 없는 타입의 경우 시작점과 끝점만 생성
        const hdg = typeof geometry.hdg === 'number' ? geometry.hdg : 0;
        const cos_hdg = Math.cos(hdg);
        const sin_hdg = Math.sin(hdg);

        points.push({ x: geometry.x, y: geometry.y });
        points.push({
          x: geometry.x + geometry.length * cos_hdg,
          y: geometry.y + geometry.length * sin_hdg,
        });
        break;
      }
    }

    return points;
  } catch (error) {
    console.warn('Geometry sampling failed, using fallback points:', error);
    // 최소한의 폴백: 시작점만 반환
    return [{ x: geometry.x || 0, y: geometry.y || 0 }];
  }
}

interface SafeRoadLinesProps {
  roads: Road[];
  lineWidth?: number;
}

function SafeRoadLines({ roads, lineWidth = 0.2 }: SafeRoadLinesProps): React.JSX.Element {
  const roadGeometry = useMemo(() => {
    const allPoints: THREE.Vector3[] = [];
    const allIndices: number[] = [];
    let currentIndex = 0;
    let validRoadCount = 0;

    for (const road of roads) {
      try {
        if (!road.planView?.geometry || !Array.isArray(road.planView.geometry)) {
          continue;
        }

        const roadPoints: THREE.Vector3[] = [];

        // 각 지오메트리 세그먼트를 안전하게 샘플링
        for (const geometry of road.planView.geometry) {
          const sampledPoints = safeSampleGeometry(geometry);

          for (const point of sampledPoints) {
            if (isFinite(point.x) && isFinite(point.y)) {
              roadPoints.push(new THREE.Vector3(point.x, 0, -point.y));
            }
          }
        }

        if (roadPoints.length >= 2) {
          allPoints.push(...roadPoints);

          for (let i = 0; i < roadPoints.length - 1; i++) {
            allIndices.push(currentIndex + i, currentIndex + i + 1);
          }

          currentIndex += roadPoints.length;
          validRoadCount++;
        }
      } catch (error) {
        console.warn(`Failed to render road ${road.id}:`, error);
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

    return { geometry, validRoadCount };
  }, [roads]);

  if (!roadGeometry) {
    return <></>;
  }

  return (
    <>
      <lineSegments geometry={roadGeometry.geometry}>
        <lineBasicMaterial color="#ffaa00" linewidth={lineWidth} transparent opacity={0.8} />
      </lineSegments>

      <Text position={[0, 5, 0]} fontSize={2} color="#ffaa00" anchorX="center" anchorY="middle">
        {`폴백 모드: ${roadGeometry.validRoadCount}개 도로 렌더링됨`}
      </Text>
    </>
  );
}

interface ErrorInfoDisplayProps {
  errors: UserFriendlyError[];
  warnings: string[];
}

function ErrorInfoDisplay({ errors, warnings }: ErrorInfoDisplayProps): React.JSX.Element {
  const errorText = useMemo(() => {
    const lines: string[] = [];

    if (errors.length > 0) {
      lines.push(`오류 ${errors.length}개:`);
      errors.slice(0, 3).forEach((error, index) => {
        lines.push(`${index + 1}. ${error.title}`);
      });
      if (errors.length > 3) {
        lines.push(`... 및 ${errors.length - 3}개 더`);
      }
    }

    if (warnings.length > 0) {
      lines.push('');
      lines.push(`경고 ${warnings.length}개:`);
      warnings.slice(0, 2).forEach((warning, index) => {
        lines.push(`${index + 1}. ${warning}`);
      });
      if (warnings.length > 2) {
        lines.push(`... 및 ${warnings.length - 2}개 더`);
      }
    }

    return lines.join('\n');
  }, [errors, warnings]);

  return (
    <Text
      position={[0, -5, 0]}
      fontSize={1}
      color="#ff6b6b"
      anchorX="center"
      anchorY="top"
      maxWidth={50}
      textAlign="center"
    >
      {errorText}
    </Text>
  );
}

//기본 3D 장면
function EmptySceneFallback(): React.JSX.Element {
  return (
    <>
      {/* 기본 큐브 */}
      <mesh position={[0, 1, 0]}>
        <boxGeometry args={[2, 2, 2]} />
        <meshStandardMaterial color="#666666" wireframe />
      </mesh>

      <Text position={[0, 4, 0]} fontSize={2} color="#ffffff" anchorX="center" anchorY="middle">
        OpenDRIVE 데이터 없음
      </Text>

      <Text position={[0, 2, 0]} fontSize={1} color="#cccccc" anchorX="center" anchorY="middle">
        유효한 도로 데이터를 로드해주세요
      </Text>
    </>
  );
}

export default function FallbackRenderer({
  openDriveData,
  errors = [],
  warnings = [],
  width = '100%',
  height = '100vh',
  showGrid = true,
  showErrorInfo = true,
}: FallbackRendererProps): React.JSX.Element {
  // 데이터 검증
  const validationResult = useMemo(() => {
    if (!openDriveData) {
      return { isValid: false, errors: [], warnings: [], hasPartialData: false };
    }

    const result = validateOpenDriveData(openDriveData);
    const hasPartialData = openDriveData.road && openDriveData.road.length > 0;

    return { ...result, hasPartialData };
  }, [openDriveData]);

  const allErrors = [...errors, ...validationResult.errors];
  const allWarnings = [...warnings, ...validationResult.warnings];

  return (
    <Canvas
      camera={{
        position: [0, 30, 30],
        fov: 60,
        near: 0.1,
        far: 1000,
      }}
      style={{
        width: typeof width === 'number' ? `${width}px` : width,
        height: typeof height === 'number' ? `${height}px` : height,
        backgroundColor: '#1a1a1a',
      }}
    >
      {/* 기본 조명 */}
      <ambientLight intensity={0.4} />
      <directionalLight position={[10, 10, 5]} intensity={0.8} />

      {/* 그리드 */}
      {showGrid && (
        <Grid
          infiniteGrid
          cellSize={5}
          cellThickness={0.3}
          cellColor="#444444"
          sectionSize={50}
          sectionThickness={0.8}
          sectionColor="#666666"
          fadeDistance={200}
          fadeStrength={1}
        />
      )}

      {/* 카메라 컨트롤 */}
      <OrbitControls
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        enableDamping={true}
        dampingFactor={0.05}
        minDistance={5}
        maxDistance={200}
        maxPolarAngle={Math.PI / 2}
      />

      {/* 콘텐츠 렌더링 */}
      {validationResult.hasPartialData && openDriveData ? (
        <>
          {/* 부분적으로 유효한 도로 데이터 렌더링 */}
          <SafeRoadLines roads={openDriveData.road} />

          {/* 오류/경고 정보 표시 */}
          {showErrorInfo && (allErrors.length > 0 || allWarnings.length > 0) && (
            <ErrorInfoDisplay errors={allErrors} warnings={allWarnings} />
          )}
        </>
      ) : (
        /* 데이터가 전혀 없는 경우 기본 장면 */
        <EmptySceneFallback />
      )}
    </Canvas>
  );
}

interface Simple2DFallbackProps {
  openDriveData?: OpenDriveData;
  width?: string | number;
  height?: string | number;
}

export function Simple2DFallback({
  openDriveData,
  width = '100%',
  height = '100vh',
}: Simple2DFallbackProps): React.JSX.Element {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 캔버스 초기화
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#1a1a1a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if (!openDriveData?.road) {
      ctx.fillStyle = '#ffffff';
      ctx.font = '24px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('OpenDRIVE 데이터 없음', canvas.width / 2, canvas.height / 2);
      ctx.font = '16px Arial';
      ctx.fillText('WebGL을 지원하지 않는 환경입니다', canvas.width / 2, canvas.height / 2 + 40);
      return;
    }

    // 도로 데이터 렌더링
    ctx.strokeStyle = '#ffaa00';
    ctx.lineWidth = 2;

    let minX = Infinity,
      maxX = -Infinity;
    let minY = Infinity,
      maxY = -Infinity;

    // 경계 계산
    for (const road of openDriveData.road) {
      if (!road.planView?.geometry) continue;

      for (const geometry of road.planView.geometry) {
        const points = safeSampleGeometry(geometry);
        for (const point of points) {
          minX = Math.min(minX, point.x);
          maxX = Math.max(maxX, point.x);
          minY = Math.min(minY, point.y);
          maxY = Math.max(maxY, point.y);
        }
      }
    }

    // 스케일 계산
    const dataWidth = maxX - minX;
    const dataHeight = maxY - minY;
    const scale = Math.min((canvas.width - 40) / dataWidth, (canvas.height - 40) / dataHeight);

    const offsetX = (canvas.width - dataWidth * scale) / 2 - minX * scale;
    const offsetY = (canvas.height - dataHeight * scale) / 2 - minY * scale;

    // 도로 그리기
    for (const road of openDriveData.road) {
      if (!road.planView?.geometry) continue;

      ctx.beginPath();
      let isFirstPoint = true;

      for (const geometry of road.planView.geometry) {
        const points = safeSampleGeometry(geometry);

        for (const point of points) {
          const x = point.x * scale + offsetX;
          const y = canvas.height - (point.y * scale + offsetY);

          if (isFirstPoint) {
            ctx.moveTo(x, y);
            isFirstPoint = false;
          } else {
            ctx.lineTo(x, y);
          }
        }
      }

      ctx.stroke();
    }

    ctx.fillStyle = '#ffffff';
    ctx.font = '14px Arial';
    ctx.textAlign = 'left';
    ctx.fillText('2D 폴백 모드 (WebGL 미지원)', 10, 25);
    ctx.fillText(`도로 수: ${openDriveData.road.length}`, 10, 45);
  }, [openDriveData]);

  return (
    <div
      style={{
        width: typeof width === 'number' ? `${width}px` : width,
        height: typeof height === 'number' ? `${height}px` : height,
        position: 'relative',
        backgroundColor: '#1a1a1a',
      }}
    >
      <canvas
        ref={canvasRef}
        width={800}
        height={600}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'contain',
        }}
      />
    </div>
  );
}
