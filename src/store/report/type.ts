//주행 현황 조회(n/15)
export type DrivingProgress = {
  reportId: string;
  numberOfDriving: number; // 현재 스탬프
};

export type DrivingSummaryArg = { reportId: number };

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
