import { useCallback, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { skipToken } from '@reduxjs/toolkit/query';
import {
  useGetTimelineInfiniteQuery,
  useGetTimelineDrivingInfiniteQuery,
  useGetTimelineReportsInfiniteQuery,
} from '@/store/driving/drivingApi';
import useIntersectHandler from '@/hooks/useIntersectHandler';
import { groupByDate } from '@/utils/groupByDate';
import { TIMELINE_DEFAULT_ARG } from '@/constants/driving';
import DrivingCard from './DrivingCard';
import ReportCard from './ReportCard';
import * as Styled from './DrivingHistory.styles';

type Tab = 'all' | 'driving' | 'reports';

const TABS: Array<{ key: Tab; label: string }> = [
  { key: 'all', label: '전체' },
  { key: 'driving', label: '주행' },
  { key: 'reports', label: '리포트' },
];

export default function DrivingHistory() {
  const [searchParams, setSearchParams] = useSearchParams();
  const tabParam = searchParams.get('tab');

  const isValidTab = (v: unknown): v is Tab => v === 'all' || v === 'driving' || v === 'reports';
  const tab: Tab = isValidTab(tabParam) ? tabParam : 'all';

  useEffect(() => {
    if (!isValidTab(tabParam)) {
      setSearchParams({ tab: 'all' }, { replace: true });
    }
  }, [tabParam, setSearchParams]);

  const handleTab = useCallback(
    (next: Tab) => setSearchParams({ tab: next }, { replace: true }),
    [setSearchParams],
  );

  const allQ = useGetTimelineInfiniteQuery(tab === 'all' ? TIMELINE_DEFAULT_ARG : skipToken, {
    refetchOnMountOrArgChange: true,
  });
  const drvQ = useGetTimelineDrivingInfiniteQuery(
    tab === 'driving' ? TIMELINE_DEFAULT_ARG : skipToken,
    {
      refetchOnMountOrArgChange: true,
    },
  );
  const rptQ = useGetTimelineReportsInfiniteQuery(
    tab === 'reports' ? TIMELINE_DEFAULT_ARG : skipToken,
    {
      refetchOnMountOrArgChange: true,
    },
  );

  const currentQ = tab === 'all' ? allQ : tab === 'driving' ? drvQ : rptQ;

  const snapshot = currentQ.data;
  const rawItems = (snapshot?.pages ?? []).flatMap((p) => p?.items ?? []);

  const displayedItems = useMemo(() => {
    if (tab === 'driving') return rawItems.filter((i) => i.type === 'DRIVING');
    if (tab === 'reports') return rawItems.filter((i) => i.type === 'REPORT');
    return rawItems;
  }, [rawItems, tab]);

  const sections = useMemo(() => groupByDate(displayedItems), [displayedItems]);

  const formatDateLabel = useCallback((d: string) => {
    const [y, m, day] = d.split('-');
    return `${y}년 ${m}월 ${day}일`;
  }, []);

  const hasNextPage = currentQ.hasNextPage;
  const isFetchingNext = currentQ.isFetchingNextPage;

  const onIntersect = useCallback(() => {
    if (!hasNextPage || isFetchingNext) return;
    currentQ.fetchNextPage();
  }, [hasNextPage, isFetchingNext, currentQ]);
  const target = useIntersectHandler(onIntersect);

  return (
    <Styled.Wrapper>
      <Styled.TabWrapper aria-label="주행 리포트 탭">
        <Styled.TabList>
          {TABS.map(({ key, label }) => (
            <li key={key}>
              <Styled.TabButton
                aria-current={tab === key ? 'page' : undefined}
                $active={tab === key}
                onClick={() => handleTab(key)}
              >
                {label}
              </Styled.TabButton>
            </li>
          ))}
        </Styled.TabList>
      </Styled.TabWrapper>
      <div key={`list-pane-${tab}`}>
        {sections.length === 0 ? (
          <Styled.EmptyState>주행기록이 없습니다.</Styled.EmptyState>
        ) : (
          sections.map((sec) => (
            <section key={sec.date} style={{ marginBottom: 16 }}>
              <Styled.DateTitle>{formatDateLabel(sec.date)}</Styled.DateTitle>
              <Styled.ItemList>
                {sec.items.map((item) => {
                  if (item.type === 'DRIVING') {
                    return (
                      <DrivingCard key={`drv-${item.id}`} status={item.status} data={item.data} />
                    );
                  }
                  if (item.type === 'REPORT') {
                    return (
                      <ReportCard key={`rpt-${item.id}`} status={item.status} data={item.data} />
                    );
                  }
                  return null;
                })}
              </Styled.ItemList>
            </section>
          ))
        )}
        {hasNextPage && (
          <Styled.LoadMore>
            {isFetchingNext ? '불러오는 중…' : <div ref={target} />}
          </Styled.LoadMore>
        )}
      </div>
    </Styled.Wrapper>
  );
}
