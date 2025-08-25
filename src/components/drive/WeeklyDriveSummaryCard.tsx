import { theme } from '@/styles/theme';
import * as styled from '@components/drive/WeeklyDriveSummaryCard.styles';

export default function WeeklyDriveSummaryCard() {
  return (
    <styled.SummaryWrapper>
      <styled.Title>최근 7일 주행 요약</styled.Title>
      <styled.MetricsContainer>
        <styled.MetricItem>
          <styled.Dot color={theme.colors.accent_orange} />
          <styled.MetricLabel>평균주행시간</styled.MetricLabel>
          <styled.MetricValue>0분</styled.MetricValue>
        </styled.MetricItem>
        <styled.MetricItem>
          <styled.Dot color={theme.colors.accent_green} />
          <styled.MetricLabel>주행 거리</styled.MetricLabel>
          <styled.MetricValue>0 km/h</styled.MetricValue>
        </styled.MetricItem>
        <styled.MetricItem>
          <styled.Dot color={theme.colors.accent_pink} />
          <styled.MetricLabel>차선 변경횟수</styled.MetricLabel>
          <styled.MetricValue>0회</styled.MetricValue>
        </styled.MetricItem>
        <styled.MetricItem>
          <styled.Dot color={theme.colors.accent_purple} />
          <styled.MetricLabel>급제동 횟수</styled.MetricLabel>
          <styled.MetricValue>0회</styled.MetricValue>
        </styled.MetricItem>
      </styled.MetricsContainer>
    </styled.SummaryWrapper>
  );
}
