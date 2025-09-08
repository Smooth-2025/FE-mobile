export interface PerformanceMetrics {
  parseTime: number;
  samplingTime: number; //샘플링 시간
  boundaryCalculationTime: number; //경계 계산 시간
  renderPrepTime: number; //렌더링 준비 시간
  totalTime: number; //총 처리 시간
  memoryUsage: number; //메모리 사용량 (MB)
  pointCount: number; //생성된 점의 수
  roadCount: number; //도로 수
  laneCount: number; //차선 수
  fileSize: number; //파일 크기 (바이트)
}

export const PERFORMANCE_THRESHOLDS = {
  MAX_PARSE_TIME: 5000, //최대 파싱 시간
  MAX_TOTAL_TIME: 10000, //최대 총 처리 시간
  MAX_MEMORY_USAGE: 500, //최대 메모리 사용량 (MB)
  MAX_POINT_COUNT: 100000, //최대 점 수
  TARGET_FPS: 30, //목표 FPS
} as const;

export class PerformanceMonitor {
  private startTime: number = 0;
  private metrics: Partial<PerformanceMetrics> = {};
  private timers: Map<string, number> = new Map();

  //성능 측정 시작
  start(): void {
    this.startTime = performance.now();
    this.metrics = {};
    this.timers.clear();
  }

  //특정 작업의 시간 측정 시작
  startTimer(name: string): void {
    this.timers.set(name, performance.now());
  }

  //특정 작업의 시간 측정 종료
  endTimer(name: string): number {
    const startTime = this.timers.get(name);
    if (!startTime) {
      console.warn(`Timer '${name}' was not started`);
      return 0;
    }

    const duration = performance.now() - startTime;
    this.timers.delete(name);
    return duration;
  }

  //파싱 성능 기록
  recordParseTime(duration: number): void {
    this.metrics.parseTime = duration;
  }

  //샘플링 성능 기록
  recordSamplingTime(duration: number): void {
    this.metrics.samplingTime = duration;
  }

  //경계 계산 성능 기록
  recordBoundaryCalculationTime(duration: number): void {
    this.metrics.boundaryCalculationTime = duration;
  }

  //렌더링 준비 성능 기록
  recordRenderPrepTime(duration: number): void {
    this.metrics.renderPrepTime = duration;
  }

  //데이터 메트릭 기록
  recordDataMetrics(
    pointCount: number,
    roadCount: number,
    laneCount: number,
    fileSize: number,
  ): void {
    this.metrics.pointCount = pointCount;
    this.metrics.roadCount = roadCount;
    this.metrics.laneCount = laneCount;
    this.metrics.fileSize = fileSize;
  }

  //메모리 사용량 측정
  measureMemoryUsage(): number {
    if ('memory' in performance) {
      const memory = (performance as unknown as { memory: { usedJSHeapSize: number } }).memory;
      const usedMB = memory.usedJSHeapSize / (1024 * 1024);
      this.metrics.memoryUsage = usedMB;
      return usedMB;
    }
    return 0;
  }

  // 성능 측정 완료 및 결과 반환
  finish(): PerformanceMetrics {
    const totalTime = performance.now() - this.startTime;
    this.metrics.totalTime = totalTime;

    // 메모리 사용량 측정
    this.measureMemoryUsage();

    return this.metrics as PerformanceMetrics;
  }

  //성능 경고 확인
  checkPerformanceWarnings(metrics: PerformanceMetrics): string[] {
    const warnings: string[] = [];

    if (metrics.parseTime > PERFORMANCE_THRESHOLDS.MAX_PARSE_TIME) {
      warnings.push(
        `파싱 시간이 임계값을 초과했습니다: ${metrics.parseTime.toFixed(0)}ms > ${PERFORMANCE_THRESHOLDS.MAX_PARSE_TIME}ms`,
      );
    }

    if (metrics.totalTime > PERFORMANCE_THRESHOLDS.MAX_TOTAL_TIME) {
      warnings.push(
        `총 처리 시간이 임계값을 초과했습니다: ${metrics.totalTime.toFixed(0)}ms > ${PERFORMANCE_THRESHOLDS.MAX_TOTAL_TIME}ms`,
      );
    }

    if (metrics.memoryUsage > PERFORMANCE_THRESHOLDS.MAX_MEMORY_USAGE) {
      warnings.push(
        `메모리 사용량이 임계값을 초과했습니다: ${metrics.memoryUsage.toFixed(1)}MB > ${PERFORMANCE_THRESHOLDS.MAX_MEMORY_USAGE}MB`,
      );
    }

    if (metrics.pointCount > PERFORMANCE_THRESHOLDS.MAX_POINT_COUNT) {
      warnings.push(
        `생성된 점의 수가 임계값을 초과했습니다: ${metrics.pointCount} > ${PERFORMANCE_THRESHOLDS.MAX_POINT_COUNT}`,
      );
    }

    return warnings;
  }

  //성능 보고서 생성
  generateReport(metrics: PerformanceMetrics): string {
    const warnings = this.checkPerformanceWarnings(metrics);

    let report = '=== OpenDRIVE 성능 보고서 ===\n\n';

    report += '처리 시간:\n';
    report += `  - 파싱: ${metrics.parseTime.toFixed(1)}ms\n`;
    report += `  - 샘플링: ${metrics.samplingTime.toFixed(1)}ms\n`;
    report += `  - 경계 계산: ${metrics.boundaryCalculationTime.toFixed(1)}ms\n`;
    report += `  - 렌더링 준비: ${metrics.renderPrepTime.toFixed(1)}ms\n`;
    report += `  - 총 시간: ${metrics.totalTime.toFixed(1)}ms\n\n`;

    report += '데이터 메트릭:\n';
    report += `  - 파일 크기: ${(metrics.fileSize / 1024 / 1024).toFixed(2)}MB\n`;
    report += `  - 도로 수: ${metrics.roadCount}개\n`;
    report += `  - 차선 수: ${metrics.laneCount}개\n`;
    report += `  - 생성된 점: ${metrics.pointCount.toLocaleString()}개\n`;
    report += `  - 메모리 사용량: ${metrics.memoryUsage.toFixed(1)}MB\n\n`;

    if (warnings.length > 0) {
      report += '⚠️ 성능 경고:\n';
      warnings.forEach((warning) => {
        report += `  - ${warning}\n`;
      });
      report += '\n';
    }

    report += '성능 점수:\n';
    const score = this.calculatePerformanceScore(metrics);
    report += `  - 전체 점수: ${score.toFixed(1)}/100\n`;

    return report;
  }

  //성능 점수 계산 (0-100)
  private calculatePerformanceScore(metrics: PerformanceMetrics): number {
    let score = 100;

    // 파싱 시간 점수 (25점)
    const parseScore = Math.max(
      0,
      25 - (metrics.parseTime / PERFORMANCE_THRESHOLDS.MAX_PARSE_TIME) * 25,
    );

    // 총 처리 시간 점수 (25점)
    const totalTimeScore = Math.max(
      0,
      25 - (metrics.totalTime / PERFORMANCE_THRESHOLDS.MAX_TOTAL_TIME) * 25,
    );

    // 메모리 사용량 점수 (25점)
    const memoryScore = Math.max(
      0,
      25 - (metrics.memoryUsage / PERFORMANCE_THRESHOLDS.MAX_MEMORY_USAGE) * 25,
    );

    // 점 수 효율성 점수 (25점)
    const pointEfficiencyScore = Math.max(
      0,
      25 - (metrics.pointCount / PERFORMANCE_THRESHOLDS.MAX_POINT_COUNT) * 25,
    );

    score = parseScore + totalTimeScore + memoryScore + pointEfficiencyScore;

    return Math.max(0, Math.min(100, score));
  }
}

export class FPSMonitor {
  private frameCount: number = 0;
  private lastTime: number = 0;
  private fps: number = 0;
  private isRunning: boolean = false;

  //FPS 모니터링 시작
  start(): void {
    this.isRunning = true;
    this.frameCount = 0;
    this.lastTime = performance.now();
    this.tick();
  }

  //FPS 모니터링 중지
  stop(): void {
    this.isRunning = false;
  }

  //현재 FPS 반환
  getFPS(): number {
    return this.fps;
  }

  //FPS가 목표값 이상인지 확인
  isPerformanceGood(): boolean {
    return this.fps >= PERFORMANCE_THRESHOLDS.TARGET_FPS;
  }

  //프레임 카운트 업데이트
  private tick = (): void => {
    if (!this.isRunning) return;

    this.frameCount++;
    const currentTime = performance.now();
    const deltaTime = currentTime - this.lastTime;

    // 1초마다 FPS 계산
    if (deltaTime >= 1000) {
      this.fps = Math.round((this.frameCount * 1000) / deltaTime);
      this.frameCount = 0;
      this.lastTime = currentTime;
    }

    requestAnimationFrame(this.tick);
  };
}

//메모리 사용량 최적화
export class MemoryOptimizer {
  private static readonly CHUNK_SIZE = 10000; // 한 번에 처리할 점의 수

  // 대용량 점 배열을 청크 단위로 처리
  static processPointsInChunks<T, R>(
    points: T[],
    processor: (chunk: T[]) => R[],
    onProgress?: (progress: number) => void,
  ): R[] {
    const results: R[] = [];

    for (let i = 0; i < points.length; i += this.CHUNK_SIZE) {
      const chunk = points.slice(i, i + this.CHUNK_SIZE);
      const chunkResults = processor(chunk);
      results.push(...chunkResults);

      // 진행률 보고
      if (onProgress) {
        const progress = Math.min(100, (i / points.length) * 100);
        onProgress(progress);
      }

      // 가비지 컬렉션 짧은 대기 (5개 청크마다 잠시 대기)
      if (i % (this.CHUNK_SIZE * 5) === 0) {
        setTimeout(() => {}, 0);
      }
    }

    return results;
  }

  // 메모리 사용량 확인
  static getMemoryUsage(): { used: number; total: number; percentage: number } {
    if ('memory' in performance) {
      const memory = (
        performance as unknown as {
          memory: {
            usedJSHeapSize: number;
            totalJSHeapSize: number;
          };
        }
      ).memory;
      const used = memory.usedJSHeapSize / (1024 * 1024); // MB
      const total = memory.totalJSHeapSize / (1024 * 1024); // MB
      const percentage = (used / total) * 100;

      return { used, total, percentage };
    }

    return { used: 0, total: 0, percentage: 0 };
  }

  // 메모리 정리 제안
  static suggestMemoryCleanup(): boolean {
    const usage = this.getMemoryUsage();
    return usage.percentage > 80; // 80% 이상 사용 시 정리 제안
  }
}

// LOD(Level of Detail) 관리
export class LODManager {
  private static readonly LOD_LEVELS = {
    HIGH: { samplingResolution: 2.0, maxDistance: 100 },
    MEDIUM: { samplingResolution: 1.0, maxDistance: 500 },
    LOW: { samplingResolution: 0.5, maxDistance: Infinity },
  } as const;

  //카메라 거리에 따른 LOD 레벨 결정
  static getLODLevel(cameraDistance: number): keyof typeof LODManager.LOD_LEVELS {
    if (cameraDistance <= this.LOD_LEVELS.HIGH.maxDistance) {
      return 'HIGH';
    } else if (cameraDistance <= this.LOD_LEVELS.MEDIUM.maxDistance) {
      return 'MEDIUM';
    } else {
      return 'LOW';
    }
  }

  //LOD 레벨에 따른 샘플링 해상도 반환
  static getSamplingResolution(lodLevel: keyof typeof LODManager.LOD_LEVELS): number {
    return this.LOD_LEVELS[lodLevel].samplingResolution;
  }

  static adjustLODForPerformance(
    currentFPS: number,
    currentLOD: keyof typeof LODManager.LOD_LEVELS,
  ): keyof typeof LODManager.LOD_LEVELS {
    if (currentFPS < PERFORMANCE_THRESHOLDS.TARGET_FPS) {
      // 성능이 낮으면 LOD 레벨 낮춤
      if (currentLOD === 'HIGH') return 'MEDIUM';
      if (currentLOD === 'MEDIUM') return 'LOW';
    } else if (currentFPS > PERFORMANCE_THRESHOLDS.TARGET_FPS + 10) {
      // 성능이 충분하면 LOD 레벨 높임
      if (currentLOD === 'LOW') return 'MEDIUM';
      if (currentLOD === 'MEDIUM') return 'HIGH';
    }

    return currentLOD;
  }
}

export const globalPerformanceMonitor = new PerformanceMonitor();
export const globalFPSMonitor = new FPSMonitor();
