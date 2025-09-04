//주행 현황 조회(n/15)
export type DrivingProgress = {
  reportId: string;
  numberOfDriving: number; // 현재 스탬프
};

export type ReportArg = { reportId: number };

//리포트 상세1_주행 정보
export type DrivingSummary = {
  reportId: string; // 리포트 식별용
  totalDistanceKm: number; // 15회 총 주행 거리
  periodStart: string; // 첫 주행 날짜
  periodEnd: string; // 마지막 주행 날짜
  averageDurationSec: number; // 평균 주행 소요 시간 (초)
  averageDistanceKm: number; // 평균 주행 거리
  averageSpeedKmh: number; // 평균 속도
  averageCruiseRatio: number; // 평균 정속 주행률
};

// 특정 행동의 전후 비교용
type BehaviorCompare = {
  before: number; // 이전 값
  current: number; // 이번 값
};

// 시간대별 행동 카운트
type BehaviorCount = {
  timeSlot: string; // 시간대 (예: 출근, 퇴근)
  count: number; // 발생 횟수
};

// 요일+행동 데이터 (라인차트용)
export type DailyBehavior = {
  weekday: string; // 예: "월", "화"
  actions: {
    hardBrake: BehaviorCount;
    rapidAccel: BehaviorCount;
    laneChange: BehaviorCount;
  };
};

// 이번 리포트 총합
type BehaviorTotalCounts = {
  hardBrake: number;
  rapidAccel: number;
  laneChange: number;
  total: number;
};

// 주행 패턴 분석
type DrivingPattern = {
  weekday: string; // 대표 요일 (예: 금요일)
  timeslot: string; // 대표 시간대 (예: 퇴근, 낮)
  chart: DailyBehavior[]; // 라인차트용 데이터
  comment: string; // 코멘트
};

// 이전 리포트와 비교 차트
export type DrivingComparChart = {
  hardBrake: BehaviorCompare;
  rapidAccel: BehaviorCompare;
  laneChange: BehaviorCompare;
};

// 이전 리포트와 비교
type DrivingCompare = {
  incdec: number; // 증가/감소 비율 (%)
  chart: DrivingComparChart;
};
//리포트 상세2_주행 행동 요약
export type DrivingBehavior = {
  reportId: string;
  totalCounts: BehaviorTotalCounts;
  drivingPattern: DrivingPattern;
  compare: DrivingCompare;
};

// 벤치마크 차트 데이터
export type BenchmarkChart = {
  labels: string[]; // 비교 대상 라벨
  valuesSec: number[]; // 반응 시간 (초)
};

// 벤치마크 정보
type Benchmark = {
  deltaSec: number; // 내 반응 속도가 평균 대비 몇 초 차이 나는지 (+ 빠름, - 느림)
  chart: BenchmarkChart;
};

//리포트 상세3_사고 알림 반응 분석
export type AccidentResponse = {
  reportId: string; // 리포트 식별자
  receivedAlertCount: number; // 수신한 사고 알림 수
  avgReactionSec: number; // 내 평균 반응 시간 (초)
  brakeOrStopRatio: number; // 감속/정지 반응 비율 (%)
  avoidRatio: number; // 우회 반응 비율 (%)
  benchmark: Benchmark; // 벤치마크 데이터
};
