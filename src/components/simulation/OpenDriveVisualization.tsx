import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import * as Styled from '@/components/simulation/OpenDriveVisualization.styles';
import LoadingIndicator from '@/components/simulation/LoadingIndicator';
import ErrorDisplay from '@/components/simulation/ErrorDisplay';
import { calculateLaneBoundaries } from '@/components/simulation/LaneBoundaryCalculator';
import { sampleRoadGeometry } from '@/components/simulation/GeometrySampler';
import { ErrorBoundary } from '@/components/simulation/ErrorBoundary';
import { parseXodrFile } from '@/components/simulation/XodrParser';
import { FallbackRenderer, Simple2DFallback } from '@/components/simulation/FallbackRenderer';
import { XodrGround3D } from '@/components/simulation/XodrGround3D';
import {
  PerformanceMonitor,
  FPSMonitor,
  LODManager,
  PERFORMANCE_THRESHOLDS,
  type PerformanceMetrics,
} from '@/components/simulation/PerformanceMonitor';
import {
  validateOpenDriveData,
  checkWebGLSupport,
  estimateMemoryUsage,
  safeAsyncOperation,
  createUserFriendlyError,
  type UserFriendlyError,
} from '@/components/simulation/ErrorHandling';
import type { OpenDriveData, LaneBoundaryData, Road, Point2D } from '@/components/simulation/types';

interface OpenDriveVisualizationProps {
  xodrFilePath?: string;
  width?: string | number;
  height?: string | number;
  samplingResolution?: number; //지오메트리 샘플링 해상도 (점/미터)
  roadLineWidth?: number; //도로 라인 두께
  laneLineWidth?: number; //차선 라인 두께
  onError?: (error: Error) => void; //오류 발생 시 콜백 함수
  onLoadComplete?: (data: OpenDriveData) => void; //로딩 완료 시 콜백 함수
  onPerformanceMetrics?: (metrics: PerformanceMetrics) => void; //성능 메트릭 콜백 함수
  enablePerformanceOptimization?: boolean; //성능 최적화 활성화 여부
  enableDynamicLOD?: boolean; //동적 LOD 활성화 여부
}

type LoadingState = 'idle' | 'loading' | 'success' | 'error';

export default function OpenDriveVisualization({
  xodrFilePath = '/maps/Town10HD_Opt.xodr',
  width = '',
  height = '',
  samplingResolution = 1,
  roadLineWidth = 0.2,
  laneLineWidth = 0.15,
  onError,
  onLoadComplete,
  onPerformanceMetrics,
  enablePerformanceOptimization = true,
  enableDynamicLOD = true,
}: OpenDriveVisualizationProps) {
  const [loadingState, setLoadingState] = useState<LoadingState>('idle');
  const [openDriveData, setOpenDriveData] = useState<OpenDriveData | null>(null);
  const [laneBoundaryData, setLaneBoundaryData] = useState<LaneBoundaryData | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [userFriendlyError, setUserFriendlyError] = useState<UserFriendlyError | null>(null);
  const [validationWarnings, setValidationWarnings] = useState<string[]>([]);
  const [webglSupported, setWebglSupported] = useState<boolean>(true);
  const [useFallbackRenderer, setUseFallbackRenderer] = useState<boolean>(false);

  // 성능 최적화 상태
  const [currentLOD, setCurrentLOD] = useState<'HIGH' | 'MEDIUM' | 'LOW'>('MEDIUM');
  const [isMemoryOptimized, setIsMemoryOptimized] = useState(false);

  // 성능 모니터링 참조
  const performanceMonitorRef = useRef<PerformanceMonitor>(new PerformanceMonitor());
  const fpsMonitorRef = useRef<FPSMonitor>(new FPSMonitor());
  const onPerformanceMetricsRef = useRef(onPerformanceMetrics);

  // 최신 콜백 참조 업데이트
  useEffect(() => {
    onPerformanceMetricsRef.current = onPerformanceMetrics;
  }, [onPerformanceMetrics]);

  const optimizedSamplingResolution = useMemo(() => {
    if (!enableDynamicLOD) return samplingResolution;
    return LODManager.getSamplingResolution(currentLOD) * samplingResolution;
  }, [currentLOD, samplingResolution, enableDynamicLOD]);

  // XODR 파일을 로딩 , 파싱
  const loadXodrFile = useCallback(
    async (filePath: string): Promise<void> => {
      const monitor = performanceMonitorRef.current;

      try {
        setLoadingState('loading');
        setError(null);
        setUserFriendlyError(null);
        setValidationWarnings([]);

        // WebGL 지원 확인
        const webglCheck = checkWebGLSupport();
        if (!webglCheck.supported) {
          setWebglSupported(false);
          if (webglCheck.error) {
            setUserFriendlyError(webglCheck.error);
          }
        }

        // 성능 모니터링 시작
        if (enablePerformanceOptimization) {
          monitor.start();
          monitor.startTimer('fileLoad');
        }

        // 안전한 파일 로딩
        const fileLoadResult = await safeAsyncOperation(async () => {
          const response = await fetch(filePath);
          if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
          }
          return response.text();
        }, 'File loading');

        if (!fileLoadResult.success) {
          setUserFriendlyError(fileLoadResult.error);
          setLoadingState('error');
          return;
        }

        const xmlContent = fileLoadResult.data;
        const fileSize = new Blob([xmlContent]).size;

        // 파일 크기 및 메모리 사용량 추정
        const fileSizeMB = fileSize / (1024 * 1024);
        const shouldOptimize = fileSizeMB > 10 || enablePerformanceOptimization;
        setIsMemoryOptimized(shouldOptimize);

        if (enablePerformanceOptimization) {
          const fileLoadTime = monitor.endTimer('fileLoad');
          console.warn(`파일 로딩 완료: ${fileSizeMB.toFixed(2)}MB, ${fileLoadTime.toFixed(1)}ms`);
          monitor.startTimer('parsing');
        }

        // XML 파싱
        const parseResult = await safeAsyncOperation(async () => {
          return parseXodrFile(xmlContent);
        }, 'XML parsing');

        if (!parseResult.success) {
          setUserFriendlyError(parseResult.error);
          setLoadingState('error');
          return;
        }

        const parsedData = parseResult.data;

        // 데이터 검증
        const validation = validateOpenDriveData(parsedData);

        if (!validation.isValid) {
          // 심각한 오류가 있는 경우
          if (validation.errors.length > 0) {
            setUserFriendlyError(validation.errors[0]);

            // 부분적으로 유효한 데이터가 있으면 폴백 렌더 사용
            if (parsedData.road && parsedData.road.length > 0) {
              setUseFallbackRenderer(true);
              setOpenDriveData(parsedData);
              setValidationWarnings(validation.warnings);
            }

            setLoadingState('error');
            return;
          }
        }

        // 경고가 있으면 저장
        if (validation.warnings.length > 0) {
          setValidationWarnings(validation.warnings);
        }

        // 메모리 사용량 추정 및 경고
        const memoryEstimate = estimateMemoryUsage(parsedData);
        if (memoryEstimate.warning) {
          setValidationWarnings((prev) => [...prev, memoryEstimate.warning!]);
        }

        if (enablePerformanceOptimization) {
          const parseTime = monitor.endTimer('parsing');
          monitor.recordParseTime(parseTime);

          // 데이터 메트릭 기록
          const roadCount = parsedData.road.length;
          const laneCount = parsedData.road.reduce((total, road) => {
            return (
              total +
              road.lanes.laneSection.reduce((sectionTotal, section) => {
                return (
                  sectionTotal +
                  (section.left?.length || 0) +
                  (section.center?.length || 0) +
                  (section.right?.length || 0)
                );
              }, 0)
            );
          }, 0);

          monitor.recordDataMetrics(0, roadCount, laneCount, fileSize);
        }

        setOpenDriveData(parsedData);
        setLoadingState('success');

        // 성공 콜백 호출
        if (onLoadComplete) {
          onLoadComplete(parsedData);
        }
      } catch (err) {
        const error = err instanceof Error ? err : new Error('알 수 없는 오류가 발생했습니다');
        const friendlyError = createUserFriendlyError(error);

        setError(error);
        setUserFriendlyError(friendlyError);
        setLoadingState('error');

        // 오류 콜백 호출
        if (onError) {
          onError(error);
        }

        console.error('OpenDRIVE 파일 로딩 실패:', error);
      }
    },
    [onError, onLoadComplete, enablePerformanceOptimization],
  );

  //메모리 최적화된 차선 경계 계산
  const calculateLaneBoundariesOptimized = useCallback(
    (road: Road, centerLine: Point2D[]): LaneBoundaryData => {
      // 청크 단위로  메모리 사용량 최적화
      const chunkSize = Math.min(1000, Math.floor(PERFORMANCE_THRESHOLDS.MAX_POINT_COUNT / 10));
      const chunks: Point2D[][] = [];

      for (let i = 0; i < centerLine.length; i += chunkSize) {
        chunks.push(centerLine.slice(i, i + chunkSize));
      }

      // 각 청크별로 경계 계산
      const allBoundaries: LaneBoundaryData = {
        roadId: road.id,
        boundaries: {} as { [laneId: string]: Point2D[] },
      };

      chunks.forEach((chunk, index) => {
        try {
          const chunkBoundaries = calculateLaneBoundaries(road, chunk);

          // 결과 병합
          Object.keys(chunkBoundaries.boundaries).forEach((laneId) => {
            if (!allBoundaries.boundaries[laneId]) {
              allBoundaries.boundaries[laneId] = [];
            }
            allBoundaries.boundaries[laneId].push(...chunkBoundaries.boundaries[laneId]);
          });
        } catch (chunkError) {
          console.warn(`청크 ${index} 처리 실패:`, chunkError);
        }
      });

      return allBoundaries;
    },
    [],
  );

  // 차선 경계 데이터를 계산하는 함수
  const calculateBoundaries = useMemo(() => {
    if (!openDriveData || !openDriveData.road || openDriveData.road.length === 0) {
      return null;
    }

    const monitor = performanceMonitorRef.current;

    try {
      if (enablePerformanceOptimization) {
        monitor.startTimer('sampling');
      }

      // 첫 번째 도로에 대해서만 차선 경계 계산 (성능 최적화)
      const firstRoad = openDriveData.road[0];

      if (!firstRoad.planView?.geometry || firstRoad.planView.geometry.length === 0) {
        console.warn('첫 번째 도로에 지오메트리 데이터가 없습니다');
        return null;
      }

      // 중심선 샘플링 (최적화된 해상도 사용)
      const centerLine = sampleRoadGeometry(
        firstRoad.planView.geometry,
        optimizedSamplingResolution,
      );

      if (centerLine.length === 0) {
        console.warn('중심선 샘플링 결과가 비어있습니다');
        return null;
      }

      if (enablePerformanceOptimization) {
        const samplingTime = monitor.endTimer('sampling');
        monitor.recordSamplingTime(samplingTime);
        monitor.startTimer('boundaryCalculation');
      }

      // 차선 경계 계산 (메모리 최적화 적용)
      let boundaries;
      if (isMemoryOptimized && centerLine.length > PERFORMANCE_THRESHOLDS.MAX_POINT_COUNT / 10) {
        // 대용량 데이터의 경우 청크 단위로 처리
        boundaries = calculateLaneBoundariesOptimized(firstRoad, centerLine);
      } else {
        boundaries = calculateLaneBoundaries(firstRoad, centerLine);
      }

      if (enablePerformanceOptimization) {
        const boundaryTime = monitor.endTimer('boundaryCalculation');
        monitor.recordBoundaryCalculationTime(boundaryTime);

        // 점 수 업데이트
        const totalPoints =
          centerLine.length +
          Object.values(boundaries.boundaries).reduce(
            (sum: number, points: Point2D[]) => sum + points.length,
            0,
          );
        const currentMetrics = monitor.finish();
        monitor.recordDataMetrics(
          totalPoints,
          currentMetrics.roadCount || 1,
          currentMetrics.laneCount || 0,
          currentMetrics.fileSize || 0,
        );

        // 성능 메트릭 콜백 호출
        if (onPerformanceMetricsRef.current) {
          onPerformanceMetricsRef.current(currentMetrics);
        }
      }

      return boundaries;
    } catch (err) {
      console.error('차선 경계 계산 실패:', err);
      return null;
    }
  }, [
    openDriveData,
    enablePerformanceOptimization,
    optimizedSamplingResolution,
    isMemoryOptimized,
    calculateLaneBoundariesOptimized,
  ]);

  // FPS 모니터링 및 동적 LOD 조정
  useEffect(() => {
    if (!enableDynamicLOD || loadingState !== 'success') return;

    const fpsMonitor = fpsMonitorRef.current;
    fpsMonitor.start();

    const checkPerformance = setInterval(() => {
      const currentFPS = fpsMonitor.getFPS();
      const newLOD = LODManager.adjustLODForPerformance(currentFPS, currentLOD);

      if (newLOD !== currentLOD) {
        setCurrentLOD(newLOD);
      }
    }, 2000); // 2초마다 성능 확인

    return () => {
      clearInterval(checkPerformance);
      fpsMonitor.stop();
    };
  }, [enableDynamicLOD, loadingState, currentLOD]);

  // 차선 경계 데이터 업데이트
  useEffect(() => {
    setLaneBoundaryData(calculateBoundaries);
  }, [calculateBoundaries]);

  //컴포넌트 마운트 시 파일 로딩
  useEffect(() => {
    if (loadingState === 'idle') {
      loadXodrFile(xodrFilePath);
    }
  }, [loadXodrFile, xodrFilePath, loadingState]);

  // 재시도 핸들러
  const handleRetry = useCallback(() => {
    setLoadingState('idle');
    setError(null);
    setOpenDriveData(null);
    setLaneBoundaryData(null);
  }, []);

  return (
    <ErrorBoundary
      onError={(error, errorInfo) => {
        console.error('OpenDriveVisualization Error Boundary:', error, errorInfo);
      }}
      onRetry={handleRetry}
    >
      <Styled.Container width={width} height={height}>
        {/* 로딩 상태 표시 */}
        {loadingState === 'loading' && <LoadingIndicator />}

        {/* 오류 상태 표시 */}
        {loadingState === 'error' && (userFriendlyError || error) && (
          <ErrorDisplay
            error={error || new Error(userFriendlyError?.message || 'Unknown error')}
            onRetry={handleRetry}
          />
        )}

        {/* 3D 시각화 렌더링 */}
        {loadingState === 'success' && openDriveData && !useFallbackRenderer && webglSupported && (
          <XodrGround3D
            openDriveData={openDriveData}
            laneBoundaryData={laneBoundaryData || undefined}
            _showGrid={true}
            width={width}
            height={height}
            roadLineWidth={roadLineWidth}
            laneLineWidth={laneLineWidth}
            samplingResolution={optimizedSamplingResolution}
            showRoadLines={true}
            showLaneLines={true}
          />
        )}

        {/* 폴백 3D 렌더링 (부분적으로 유효한 데이터) */}
        {loadingState === 'success' &&
          openDriveData &&
          (useFallbackRenderer || !webglSupported) &&
          webglSupported && (
            <FallbackRenderer
              openDriveData={openDriveData}
              errors={userFriendlyError ? [userFriendlyError] : []}
              warnings={validationWarnings}
              width={width}
              height={height}
              showGrid={true}
              showErrorInfo={true}
            />
          )}

        {/* 2D 폴백 렌더링 (WebGL 미지원) */}
        {loadingState === 'success' && openDriveData && !webglSupported && (
          <Simple2DFallback openDriveData={openDriveData} width={width} height={height} />
        )}

        {/* 빈 상태 (데이터 없음) */}
        {loadingState === 'success' && !openDriveData && (
          <Styled.EmptyState>
            <div>데이터를 불러올 수 없습니다</div>
            {userFriendlyError && (
              <Styled.ErrorMessage>{userFriendlyError.message}</Styled.ErrorMessage>
            )}
          </Styled.EmptyState>
        )}

        {/* 경고 메시지 표시 */}
        {validationWarnings.length > 0 && loadingState === 'success' && (
          <Styled.WarningBox>
            <Styled.WarningTitle>경고 ({validationWarnings.length}개)</Styled.WarningTitle>
            {validationWarnings.slice(0, 2).map((warning, index) => (
              <Styled.WarningItem key={index}>• {warning}</Styled.WarningItem>
            ))}
            {validationWarnings.length > 2 && (
              <Styled.WarningMore>... 및 {validationWarnings.length - 2}개 더</Styled.WarningMore>
            )}
          </Styled.WarningBox>
        )}
      </Styled.Container>
    </ErrorBoundary>
  );
}
