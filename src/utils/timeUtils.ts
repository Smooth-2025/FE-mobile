/**
 * 분(minute) 단위를 "시간 + 분" 형식의 문자열 변환 함수

 * @param minutes 변환할 분(minute) 값
 * @returns "X시간 Y분" 혹은 "X시간" 또는 "Y분" 형태의 문자열
 */
export function formatMinutes(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const remain = minutes % 60;

  if (hours > 0 && remain > 0) {
    return `${hours} 시간 ${remain} 분`;
  } else if (hours > 0) {
    return `${hours} 시간`;
  } else {
    return `${remain} 분`;
  }
}

/**
 * ISO 문자열을 받아 "HH:mm" 24시간 형식으로 변환하는 함수
 *
 * @param iso ISO 형식의 날짜/시간 문자열
 * @returns "HH:mm" 형태의 문자열
 */
export function formatHM(iso: string): string {
  const d = new Date(iso);
  const hh = String(d.getHours()).padStart(2, '0');
  const mm = String(d.getMinutes()).padStart(2, '0');
  return `${hh}:${mm}`;
}
