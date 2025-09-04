import { theme } from '@/styles/theme';
import { formatHM, formatMinutes } from '@/utils/timeUtils';
import * as Styled from './DrivingCard.styles';
import type { TimelineDrivingData, TimelineStatus } from '@/store/driving/type';

type PropsType = {
  status: TimelineStatus;
  data: TimelineDrivingData | null;
};

export default function DrivingCard(props: PropsType) {
  if (props.status === 'PROCESSING') {
    return (
      <Styled.DrivingCardContainer $status={'PROCESSING'}>
        <Styled.MetricsSection>
          <Styled.MetricItem>
            <Styled.ProcessingIndicator>
              <span />
            </Styled.ProcessingIndicator>
            <Styled.ProcessingText>운전 정보를 정리하고 있어요.</Styled.ProcessingText>
          </Styled.MetricItem>
        </Styled.MetricsSection>
      </Styled.DrivingCardContainer>
    );
  }

  if (!props.data) return;
  const { data } = props;

  return (
    <Styled.DrivingCardContainer $status={'COMPLETED'}>
      <Styled.MetricsSection>
        <Styled.MetricItem>
          <Styled.Dot color={theme.colors.accent_orange} />
          <Styled.MetricLabel>정속 주행률</Styled.MetricLabel>
          <Styled.MetricValue>{data.cruiseRatio}%</Styled.MetricValue>
        </Styled.MetricItem>
        <Styled.MetricItem>
          <Styled.Dot color={theme.colors.accent_green} />
          <Styled.MetricLabel>평균 속도</Styled.MetricLabel>
          <Styled.MetricValue>{data.avgSpeed} km/h</Styled.MetricValue>
        </Styled.MetricItem>
        <Styled.MetricItem>
          <Styled.Dot color={theme.colors.accent_pink} />
          <Styled.MetricLabel>차선 변경횟수</Styled.MetricLabel>
          <Styled.MetricValue>{data.laneChangeCount}회</Styled.MetricValue>
        </Styled.MetricItem>
        <Styled.MetricItem>
          <Styled.Dot color={theme.colors.accent_purple} />
          <Styled.MetricLabel>급제동 횟수</Styled.MetricLabel>
          <Styled.MetricValue>{data.hardBrakeCount}회</Styled.MetricValue>
        </Styled.MetricItem>
      </Styled.MetricsSection>
      <Styled.TimeRow>
        {formatHM(data.startTime)} - {formatHM(data.endTime)} ({formatMinutes(data.drivingMinutes)})
      </Styled.TimeRow>
    </Styled.DrivingCardContainer>
  );
}
