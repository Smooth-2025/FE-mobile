import * as Styled from '@/components/report/AccidentResponse.styles';
import { useGetAccidentResponseQuery } from '@/store/report/reportApi';
import AccidentCompareChart from '@/components/report/charts/AccidentCompareChart';
import { formatDuration } from '@/utils/timeUtils';

export default function AccidentResponse({ reportId }: { reportId: number }) {
  const { data, isLoading, isError } = useGetAccidentResponseQuery({ reportId });

  if (isLoading) return <>isLoading...</>;
  if (isError) {
    return;
  }
  if (!data) return;

  const {
    receivedAlertCount,
    avgReactionSec,
    brakeOrStopRatio,
    avoidRatio,
    benchmark: { deltaSec, chart },
  } = data;

  return (
    <Styled.Section>
      <Styled.SectionTitle>사고 대응</Styled.SectionTitle>
      {/* == 주행카드 ==  */}
      <Styled.AccidentWrapper>
        <div>
          <Styled.AccidentTitle>
            사고 상황에 평균 <b>1.7초</b> <br /> 만에 반응했어요!
          </Styled.AccidentTitle>
          <Styled.AccidentSubTitle>
            빠른 감속 반응은 사고 위험을 줄이는 데 매우 중요합니다!
          </Styled.AccidentSubTitle>
          <Styled.AccidentInfoList>
            <li>
              <span>수신된 사고 알림 수</span>
              <span>{receivedAlertCount ?? 0}건</span>
            </li>
            <li>
              <span>평균 반응 시간</span>
              <span>{formatDuration(avgReactionSec ?? 0)}</span>
            </li>
            <li>
              <span>감속/정지 반응비율</span>
              <span>{brakeOrStopRatio ?? 0} %</span>
            </li>
            <li>
              <span>우회 비율</span>
              <span>{avoidRatio ?? 0} %</span>
            </li>
          </Styled.AccidentInfoList>
        </div>
        {/* == 주행차트 ==  */}
        <div>
          <Styled.AccidentTitle>
            평균 사용자보다 {` `}
            <b>{formatDuration(deltaSec ?? 0)}</b>
            <br />
            {deltaSec > 0
              ? '더 빠르게 반응하고 있어요!'
              : deltaSec < 0
                ? '더 느리게 반응하고 있어요!'
                : '동일하게 반응하고 있어요!'}
          </Styled.AccidentTitle>
          <div>
            <AccidentCompareChart data={chart} />
          </div>
        </div>
      </Styled.AccidentWrapper>
    </Styled.Section>
  );
}
