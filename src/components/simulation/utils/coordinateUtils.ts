// 더미 데이터에서 사용하는 원점과 변환 상수
export const ORIGIN_LONGITUDE = 127.00374;
export const ORIGIN_LATITUDE = 37.55807;
export const METERS_PER_LON_DEGREE = 89000.0;
export const METERS_PER_LAT_DEGREE = 111139.0;

// 도로 환경과 동일한 스케일 (RoadEnvironment에서 사용하는 SCALE)
export const ROAD_SCALE = 0.1;

export interface Point3D {
  x: number;
  y: number;
  z: number;
}

export interface LatLng {
  latitude: number;
  longitude: number;
}

/**
 * 위도경도를 미터 단위 XY 좌표로 변환
 */
export function latLngToMeters(latLng: LatLng): { x: number; y: number } {
  const x = (latLng.longitude - ORIGIN_LONGITUDE) * METERS_PER_LON_DEGREE;
  const y = (latLng.latitude - ORIGIN_LATITUDE) * METERS_PER_LAT_DEGREE;
  return { x, y };
}

/**
 * 미터 단위 XY 좌표를 Three.js 좌표로 변환 (도로 환경과 동일한 변환)
 */
export function metersToThreeCoords(
  meters: { x: number; y: number },
  centerOffset: { x: number; y: number } = { x: 0, y: 0 },
): Point3D {
  return {
    x: (meters.y - centerOffset.y) * ROAD_SCALE,
    y: 0, // 도로 위에 배치
    z: -(meters.x - centerOffset.x) * ROAD_SCALE, // Y축을 Z축으로 변환 (도로와 동일)
  };
}

/**
 * 위도경도를 직접 Three.js 좌표로 변환
 */
export function latLngToThreeCoords(
  latLng: LatLng,
  centerOffset: { x: number; y: number } = { x: 0, y: 0 },
): Point3D {
  const meters = latLngToMeters(latLng);
  return metersToThreeCoords(meters, centerOffset);
}

/**
 * 두 위도경도 점 사이의 방향각 계산 (라디안)
 */
export function calculateBearing(from: LatLng, to: LatLng): number {
  const fromMeters = latLngToMeters(from);
  const toMeters = latLngToMeters(to);

  const dx = toMeters.x - fromMeters.x;
  const dy = toMeters.y - fromMeters.y;

  return Math.atan2(dx, dy); // Three.js에서 Z축이 앞쪽이므로 atan2(x, y)
}

/**
 * 위도경도를 CARLA 원본 XY 좌표로 역변환
 * 더미 데이터의 변환 공식을 역으로 계산
 */
export function latLonToCarlaXY(latitude: number, longitude: number): { x: number; y: number } {
  // 백엔드 변환 공식의 역변환
  // longitude = origin_longitude + locationX / meters_per_lon_degree
  // latitude = origin_latitude + locationY / meters_per_lat_degree
  const locationX = (longitude - ORIGIN_LONGITUDE) * METERS_PER_LON_DEGREE;
  const locationY = (latitude - ORIGIN_LATITUDE) * METERS_PER_LAT_DEGREE;

  return { x: locationX, y: locationY };
}

/**
 * 위도경도를 ENU(East-North-Up) 좌표계로 변환 (기존 호환성 유지)
 */
export function latLonToENU(latitude: number, longitude: number): { east: number; north: number } {
  const { x, y } = latLonToCarlaXY(latitude, longitude);
  return { east: x, north: y };
}

/**
 * 위도경도 배열에서 중심점 계산
 */
export function calculateCenter(positions: LatLng[]): { x: number; y: number } {
  if (positions.length === 0) return { x: 0, y: 0 };

  const metersPositions = positions.map(latLngToMeters);
  const avgX = metersPositions.reduce((sum, pos) => sum + pos.x, 0) / metersPositions.length;
  const avgY = metersPositions.reduce((sum, pos) => sum + pos.y, 0) / metersPositions.length;

  return { x: avgX, y: avgY };
}
