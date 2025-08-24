import { theme } from '@/styles/theme';
import * as styled from './DrivingCard.styles';

export default function DrivingCard() {
  return (
    <styled.DrivingCardContainer>
      <styled.MetricsSection>
        <styled.MetricItem>
          <styled.Dot color={theme.colors.accent_orange} />
          <styled.MetricLabel>정속 주행률</styled.MetricLabel>
          <styled.MetricValue>78%</styled.MetricValue>
        </styled.MetricItem>
        <styled.MetricItem>
          <styled.Dot color={theme.colors.accent_green} />
          <styled.MetricLabel>평균 속도</styled.MetricLabel>
          <styled.MetricValue>33.7 km/h</styled.MetricValue>
        </styled.MetricItem>
        <styled.MetricItem>
          <styled.Dot color={theme.colors.accent_pink} />
          <styled.MetricLabel>차선 변경횟수</styled.MetricLabel>
          <styled.MetricValue>4회</styled.MetricValue>
        </styled.MetricItem>
        <styled.MetricItem>
          <styled.Dot color={theme.colors.accent_purple} />
          <styled.MetricLabel>급제동 횟수</styled.MetricLabel>
          <styled.MetricValue>1회</styled.MetricValue>
        </styled.MetricItem>
      </styled.MetricsSection>
      <styled.TimeRow>14:26 - 15:36 (1시간 28분)</styled.TimeRow>
    </styled.DrivingCardContainer>
  );
}
