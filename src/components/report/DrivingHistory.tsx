import { useSearchParams } from 'react-router-dom';
import DrivingCard from './DrivingCard';
import ReportCard from './ReportCard';
import * as Styled from './DrivingHistory.styles';

export default function DrivingHistory() {
  const [searchParams, setSearchParams] = useSearchParams();
  const tabParam = searchParams.get('tab');
  const tab = tabParam === 'driving' || tabParam === 'report' ? tabParam : 'all';
  const activeIndex = tab === 'all' ? 0 : tab === 'driving' ? 1 : 2;

  const handleTab = (next: 'all' | 'driving' | 'report') => {
    setSearchParams({ tab: next });
  };

  return (
    <Styled.Wrapper>
      <Styled.TabWrapper aria-label="주행 리포트 탭">
        <Styled.TabList>
          <li>
            <Styled.TabButton $active={tab === 'all'} onClick={() => handleTab('all')}>
              전체
            </Styled.TabButton>
          </li>
          <li>
            <Styled.TabButton $active={tab === 'driving'} onClick={() => handleTab('driving')}>
              주행
            </Styled.TabButton>
          </li>
          <li>
            <Styled.TabButton $active={tab === 'report'} onClick={() => handleTab('report')}>
              리포트
            </Styled.TabButton>
          </li>
        </Styled.TabList>
        <Styled.TabIndicator $index={activeIndex} />
      </Styled.TabWrapper>
      {tab === 'all' && (
        <>
          <Styled.DateTitle>2025년 09월 10일</Styled.DateTitle>
          <DrivingCard />
          <ReportCard />
        </>
      )}
      {tab === 'driving' && (
        <>
          <Styled.DateTitle>2025년 09월 10일</Styled.DateTitle>
          <DrivingCard />
        </>
      )}
      {tab === 'report' && (
        <>
          <Styled.DateTitle>2025년 09월 10일</Styled.DateTitle>
          <ReportCard />
        </>
      )}

      <></>
    </Styled.Wrapper>
  );
}
