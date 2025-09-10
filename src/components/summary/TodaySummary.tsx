import { useGetTodaySummaryQuery } from '@/store/driving/drivingApi';
import drivingCharacter from '@/assets/images/driving-charactar.png';
import { formatMinutes } from '@/utils/timeUtils';
import { Skeleton } from '@/components/common/Skeleton';
import * as styled from '@/components/summary/TodaySummary.styles';

function Placeholder() {
  return (
    <styled.P_Container>
      <styled.P_InfoBox>
        <styled.P_Info>
          <Skeleton width={50} unit="%" height={30} rounded />
          <Skeleton width={70} unit="%" height={30} rounded />
        </styled.P_Info>
        <styled.P_ImageBox>
          <Skeleton width={100} unit="%" height={100} rounded />
        </styled.P_ImageBox>
      </styled.P_InfoBox>
      <styled.P_CardBox>
        {Array.from({ length: 3 }).map((_, idx) => (
          <styled.P_Box key={idx}>
            <Skeleton width={90} unit="%" height={60} rounded />
            <Skeleton width={50} unit="%" height={60} rounded />
          </styled.P_Box>
        ))}
      </styled.P_CardBox>
    </styled.P_Container>
  );
}

export default function TodaySummary() {
  const { data, isLoading, isError } = useGetTodaySummaryQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  if (isLoading) {
    return <Placeholder />;
  }

  if (isError) {
    return;
  }
  const stats = [
    { label: '정속 주행률', value: `${data?.cruiseRatio ?? 0} %` },
    { label: '주행 시간', value: formatMinutes(data?.drivingMinutes ?? 0) },
    { label: '주행 거리', value: `${data?.totalDistance ?? 0} km` },
  ];

  return (
    <styled.TodaySummaryContainer>
      <styled.InfoWrapper>
        <styled.InfoBox>
          <styled.Title>오늘의 주행, 한눈에보기 👀</styled.Title>
          <styled.Subtitle>주행 거리와 주요 특징을 확인해보세요</styled.Subtitle>
        </styled.InfoBox>
        <styled.Character src={drivingCharacter} alt=" 캐릭터" />
      </styled.InfoWrapper>
      <styled.StatsCardWrapper>
        {stats.map((s, i) => (
          <styled.StatsBox key={s.label} isLast={i === stats.length - 1}>
            <styled.StatsLabel>{s.label}</styled.StatsLabel>
            <styled.StatsValue>{s.value}</styled.StatsValue>
          </styled.StatsBox>
        ))}
      </styled.StatsCardWrapper>
    </styled.TodaySummaryContainer>
  );
}
