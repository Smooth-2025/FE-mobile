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
