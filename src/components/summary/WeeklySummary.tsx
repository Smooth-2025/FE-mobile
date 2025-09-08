import { useGetWeeklySummaryQuery } from '@/store/driving/drivingApi';
import { theme } from '@/styles/theme';
import { formatMinutes } from '@/utils/timeUtils';
import * as styled from '@/components/summary/WeeklySummary.styles';
import { Skeleton } from '@/components/common/Skeleton';
import { MetricsList } from '@/components/common/Metric';

function Placeholder() {
  return (
    <styled.P_Container>
      <styled.P_TitleBox>
        <Skeleton width={60} unit="%" height={80} rounded />
      </styled.P_TitleBox>
      <styled.P_MetricWrapper>
        {Array.from({ length: 4 }).map((_, idx) => (
          <styled.P_MetricItem key={idx}>
            <Skeleton width={10} height={10} style={{ marginRight: '10px' }} circle />
            <Skeleton width={50} unit="%" height={100} rounded style={{ flex: '1' }} />
            <Skeleton width={20} unit="%" height={100} style={{ marginLeft: '10px' }} rounded />
          </styled.P_MetricItem>
        ))}
      </styled.P_MetricWrapper>
    </styled.P_Container>
  );
}

export default function WeeklySummary() {
  const { data, isLoading, isError } = useGetWeeklySummaryQuery();

  if (isLoading) {
    return <Placeholder />;
  }

  if (isError) {
    return;
  }

  const metrics = [
    {
      color: theme.colors.accent_orange,
      label: '총 주행시간',
      value: `${formatMinutes(data?.drivingMinutes ?? 0)}`,
    },
    {
      color: theme.colors.accent_green,
      label: '주행 거리',
      value: `${data?.totalDistance ?? 0} km`,
    },
    {
      color: theme.colors.accent_pink,
      label: '차선 변경 횟수',
      value: `${data?.laneChangeCount ?? 0} 회`,
    },
    {
      color: theme.colors.accent_purple,
      label: '급제동 횟수',
      value: `${data?.hardBrakeCount ?? 0} 회`,
    },
  ];

  return (
    <styled.WeeklySummaryContainer>
      <styled.Title>최근 7일 주행 요약</styled.Title>
      <MetricsList metrics={metrics} />
    </styled.WeeklySummaryContainer>
  );
}
