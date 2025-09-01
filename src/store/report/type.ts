//주행 현황 조회(n/15)
export type DrivingProgress = {
  userId: number;
  cycleNo: string; // 주행 리포트 갯수
  totalTrips: number; // 사용자의 전체 주행건수
  currentCycleCount: number; //현재 스탬프 개수 (2)
  threshold: number; //임계치(15)
  remainingTrips: number; // 남은 주행 기록 (15-2)
};
