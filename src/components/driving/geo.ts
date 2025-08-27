// meters, WGS84 (지구 적도 반지름)
const R = 6378137;

/**
 * createLatLonToLocalMeters
 * - 특정 기준 위경도(originLat, originLon)를 원점(0,0)으로 두고 다른 위경도(lat, lon)를 로컬 평면 좌표(m)로 변환하는 함수
 * - 반환값: 동쪽 차이는 x(m), 북쪽 차이는 y(m)
 */
export function createLatLonToLocalMeters(originLat: number, originLon: number) {
  const φ0 = (originLat * Math.PI) / 180;
  const cosφ0 = Math.cos(φ0);
  return (lat: number, lon: number) => {
    const dLon = ((lon - originLon) * Math.PI) / 180;
    const dLat = ((lat - originLat) * Math.PI) / 180;
    const x = dLon * R * cosφ0; // 동서
    const y = dLat * R; // 남북
    return { x, y };
  };
}

/**
 * computeYawFromPoints
 * - 두 지점(lat1, lon1 → lat2, lon2)을 로컬 좌표로 변환한 후, 시작점에서 끝점을 향하는 방향 각도를 계산
 * - atan2(dy, dx) 사용 → 결과 범위: -π ~ π (라디안)
 * - 반환값: 북쪽=0 기준, 시계방향으로 증가하는 yaw 값
 */
export function computeYawFromPoints(
  originLat: number,
  originLon: number,
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): number {
  const toLocal = createLatLonToLocalMeters(originLat, originLon);
  const p1 = toLocal(lat1, lon1);
  const p2 = toLocal(lat2, lon2);
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  return Math.atan2(dy, dx);
}

type HeadingState = { yaw: number | null; x: number; y: number; t: number };

/**
 * createHeadingEstimator
 * - 위치 샘플(x,y,t)을 입력받아 주행 방향(yaw)을 추정하는 함수
 * - 같은 userId 별로 상태를 Map에 저장해 프레임 간 yaw 추적
 * - 동작 방식:
 *   · 첫 프레임 → yaw=0 기본값
 *   · 이동량 거의 없음 → 이전 yaw 유지
 *   · 이동 발생 → atan2(dy, dx)로 새 각도 계산
 * - EMA(Exponential Moving Average) 스무딩 적용:
 *   nextYaw = prevYaw + (raw - prevYaw) * smooth
 *   → smooth(0~1) 클수록 새 각도에 민감하게 반응
 */
export function createHeadingEstimator(smooth = 0.25) {
  const map = new Map<number, HeadingState>();

  return function estimate(userId: number, x: number, y: number, t: number): number {
    const prev = map.get(userId);
    let nextYaw: number;

    if (!prev) {
      nextYaw = 0; // 첫 프레임은 기본값
    } else {
      const dx = x - prev.x;
      const dy = y - prev.y;
      const move2 = dx * dx + dy * dy;
      if (move2 < 1e-4) {
        nextYaw = prev.yaw ?? 0; // 거의 정지면 이전 각도 유지
      } else {
        const raw = Math.atan2(dy, dx); // -π~π
        const base = prev.yaw ?? raw;
        nextYaw = base + (raw - base) * smooth; // EMA 스무딩
      }
    }

    map.set(userId, { yaw: nextYaw, x, y, t });
    return nextYaw;
  };
}

/**
 * enuRelativeToScene
 * - ENU 좌표를 three.js 월드 좌표로 변환하는 함수
 * - ENU(동=+x, 북=+y) → three.js(X=오른쪽, Z=앞쪽)
 */
export function enuRelativeToScene(
  ego: { east: number; north: number },
  other: { east: number; north: number },
  scale: { forward: number; lateral: number },
) {
  const deltaEast = other.east - ego.east;
  const deltaNorth = other.north - ego.north;
  return { sx: deltaEast * scale.lateral, sz: -deltaNorth * scale.forward };
}
