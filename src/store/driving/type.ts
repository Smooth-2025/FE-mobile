//오늘 주행 요약
export type TodaySummary = {
  cruiseRatio: number; // 정속 주행률
  totalDistance: number; //주행거리km
  drivingMinutes: number; //주행시간(분)
};

export type CharacterType = 'NONE' | 'LION' | 'MEERKAT' | 'CAT' | 'DOLPHIN';

// 유저 성향 조회
export type CharacterTraits = {
  characterType: CharacterType; //캐릭터 종류
  characterTrait: string; //캐릭터 성향 이름
  description: string; //성향 설명
  currentDistance: number; // 현재 주행한 거리
  remainingDistance: number; // 앞으로 주행해야 하는 거리
};

//최근 7일 주행 요약
export type WeeklySummary = {
  drivingMinutes: number; // 총 주행 시간
  totalDistance: number; // 총 주행거리
  laneChangeCount: number; // 차선 변경 횟수
  hardBrakeCount: number; // 급제동 횟수
  rapidAccelCount: number; // 급가속 횟수
  sharpTurnCount: number; // 급회전 횟수
  avgSpeed: number; // 평균 속도
};

export type TimelineArg = { limit: number };
export type Cursor = string | undefined;
export type TimelineStatus = 'COMPLETED' | 'PROCESSING';

//주행 타임라인 데이터
export type TimelineDrivingData = {
  id: number; // 주행 데이터 id
  startTime: string; // 주행 시작 시간
  endTime: string; // 주행 종료 시간
  totalDistance: number; // 총 주행 거리 km
  avgSpeed: number; // 평균 속도
  cruiseRatio: number; // 정속 주행률
  laneChangeCount: number; // 차선 변경 횟수
  hardBrakeCount: number; // 급제동 횟수
  rapidAccelCount: number; // 급가속 횟수
  sharpTurnCount: number; // 급회전 횟수
  drivingMinutes: number; //주행시간(분)
};
//주행 타임라인
export type TimelineItemDriving = {
  id: string; // 주행이면 drive+id
  type: 'DRIVING'; // DRIVING or REPORT
  createdAt: string; // 생성 시간
  status: TimelineStatus; // 완료 표시
  data: TimelineDrivingData | null;
};
//리포트 타임라인 데이터
export type TimelineReportData = {
  id: number; // 리포트 id
  isRead: boolean; // 읽었는지 여부
};
//리포트 타임라인
export type TimelineItemReport = {
  id: string; // 리포트면 report + id
  type: 'REPORT'; // DRIVING or REPORT
  createdAt: string; // 생성 시간
  status: TimelineStatus; // 완료 표시
  data: TimelineReportData | null;
};

export type TimelineItem = TimelineItemDriving | TimelineItemReport;

// 주행 기록 응답
export type Timeline = {
  items: TimelineItem[];
  nextCursor: string | null;
  hasMore: boolean;
};
