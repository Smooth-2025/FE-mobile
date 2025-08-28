//오늘 주행 요약
export type TodaySummary = {
  cruiseRatio: number; // 정속 주행률
  totalDistance: number; //주행거리km
  drivingMinutes: number; //주행시간(분)
};

export type CharacterType = 'NONE' | 'LION' | 'MEERKAT' | 'CAT' | 'DOLPHIN';

// 유저 성향 조회
export type CharacterTraits = {
  character_type: CharacterType; //캐릭터 종류
  character_trait: string; //캐릭터 성향 이름
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
