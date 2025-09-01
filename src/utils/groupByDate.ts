export type HasCreatedAt = { createdAt: string };

export type DateSection<T extends HasCreatedAt> = {
  date: string;
  items: T[];
};

/**
 *  생성일(`createdAt`) 기준으로 날짜별 그룹핑 함수
 * `createdAt`은 한국시(KST) 기준의 datetime 문자열이라고 가정
 *
 * 그룹핑은 `createdAt` 문자열의 앞 10자리(YYYY-MM-DD)를 잘라서 수행합니다.
 * 최종 결과는 날짜 그룹을 최신 날짜부터 오래된 날짜 순으로 정렬합니다.
 * 각 날짜 그룹 내부의 아이템들도 `createdAt` 기준으로 최신 → 오래된 순으로 정렬합니다.
 *
 * @param items - `createdAt` 문자열을 가진  배열
 * @returns 날짜별로 그룹핑된 DateSection 객체 배열
 */
export function groupByDate<T extends HasCreatedAt>(items: T[]): DateSection<T>[] {
  const map = new Map<string, T[]>();

  for (const it of items) {
    const key = it.createdAt.slice(0, 10);
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(it);
  }

  return Array.from(map.entries())
    .sort(([a], [b]) => (a < b ? 1 : -1))
    .map(([date, list]) => ({
      date,
      items: list.sort((x, y) => y.createdAt.localeCompare(x.createdAt)),
    }));
}
