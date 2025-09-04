// 2D 좌표점
export interface Point2D {
  x: number; // X 좌표값 (미터 단위)
  y: number; // Y 좌표값 (미터 단위)
}

// 3D 좌표점 (높이 포함)
export interface Point3D extends Point2D {
  z: number; // Z 좌표값 (높이, 미터 단위)
}

// OpenDRIVE 지오메트리 요소: 도로 형태 정의 기본 단위 (line, arc, spiral 타입 지원)
export interface OpenDriveGeometry {
  s: number; // 도로를 따른 거리 좌표 (s-coordinate, 미터 단위)
  x: number; // 지오메트리 시작점의 X 좌표 (미터 단위)
  y: number; // 지오메트리 시작점의 Y 좌표 (미터 단위)
  hdg: number; // 방향각 (heading, 라디안 단위)
  length: number; // 지오메트리 요소의 길이 (미터 단위)
  type: 'line' | 'arc' | 'spiral'; // 지오메트리 타입
  curvature?: number; // 호(arc)의 곡률 (1/미터, arc 타입에서 필수)
  curvStart?: number; // 나선의 시작 곡률 (1/미터, spiral 타입에서 필수)
  curvEnd?: number; // 나선의 끝 곡률 (1/미터, spiral 타입에서 필수)
}

// 차선 폭을 정의하는 3차 다항식: w(s) = a + b*s + c*s² + d*s³ (s는 상대적 거리)
export interface LaneWidth {
  sOffset: number; // 이 폭 정의가 시작되는 s 좌표 (미터 단위)
  a: number; // 다항식 상수항 계수 (미터)
  b: number; // 다항식 1차 계수 (무차원)
  c: number; // 다항식 2차 계수 (1/미터)
  d: number; // 다항식 3차 계수 (1/미터²)
}

// 개별 차선
export interface Lane {
  id: number; // 차선 ID (음수: 우측 차선, 양수: 좌측 차선, 0: 중앙선)
  type: string; // 차선 타입 (driving, shoulder, sidewalk, border 등)
  level: boolean; // 차선이 수평 레벨인지 여부
  width: LaneWidth[]; // 차선 폭 정의 배열 (s 좌표 순으로 정렬)
}

// 차선 섹션
export interface LaneSection {
  s: number; // 섹션이 시작되는 s 좌표 (미터 단위)
  left?: Lane[]; // 좌측 차선들 (ID 오름차순 정렬, 선택적)
  center?: Lane[]; // 중앙 차선들 (일반적으로 ID 0, 선택적)
  right?: Lane[]; // 우측 차선들 (ID 내림차순 정렬, 선택적)
}

// 도로 정보
export interface Road {
  id: string; // 도로 고유 식별자
  name?: string; // 도로 이름 (선택적)
  length: number; // 도로의 총 길이 (미터 단위)
  planView: {
    geometry: OpenDriveGeometry[]; // 지오메트리 요소들 (s 좌표 순으로 정렬)
  };
  lanes: {
    laneSection: LaneSection[]; // 차선 섹션들 (s 좌표 순으로 정렬)
  };
}

// OpenDRIVE 파일 전체 데이터 구조
export interface OpenDriveData {
  header: {
    revMajor: number; // OpenDRIVE 표준 주 버전 번호
    revMinor: number; // OpenDRIVE 표준 부 버전 번호
    name?: string; // 파일 또는 프로젝트 이름 (선택적)
  };
  road: Road[]; // 도로 배열
}

// 계산된 차선 경계 데이터: LaneBoundaryCalculator 결과, 각 도로 차선별 경계 좌표 포함
export interface LaneBoundaryData {
  roadId: string; // 도로 ID
  boundaries: {
    [laneId: string]: Point2D[]; // 특정 차선 ID의 경계 좌표 배열
  };
}
