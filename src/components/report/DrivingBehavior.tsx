import * as Styled from '@/components/report/DrivingBehavior.styles';
import { useGetDrivingBehaviorQuery } from '@/store/report/reportApi';
import ComparisonChart from '@/components/report/charts/ComparisonChart';
import PatternChart from '@/components/report/charts/PatternChart';

export default function DrivingBehavior({ reportId }: { reportId: number }) {
  const { data, isLoading, isError } = useGetDrivingBehaviorQuery({ reportId });

  if (isLoading) return <>isLoading...</>;
  if (isError) {
    return;
  }
  if (!data) return;
  const { totalCounts, drivingPattern, compare } = data;

  return (
    <Styled.Section>
      <Styled.SectionTitle>주행 분석</Styled.SectionTitle>
      <Styled.BehaviorWrapper>
        {/* == 주행카드 ==  */}
        <div>
          <Styled.BehaviorTitle>운전 행동 요약</Styled.BehaviorTitle>
          <Styled.BehaviorList>
            <Styled.BehaviorItem>
              <h4>급제동</h4>
              <p>
                <span>{totalCounts.hardBrake}</span>회
              </p>
            </Styled.BehaviorItem>
            <Styled.BehaviorItem>
              <h4>급가속</h4>
              <p>
                <span>{totalCounts.rapidAccel}</span>회
              </p>
            </Styled.BehaviorItem>
            <Styled.BehaviorItem>
              <h4>차선변경</h4>
              <p>
                <span>{totalCounts.laneChange}</span>회
              </p>
            </Styled.BehaviorItem>
          </Styled.BehaviorList>
        </div>

        {/* == 주행 차트1 ==  */}
        <div>
          <Styled.BehaviorTitle>
            이번 주행에는 {` `}
            <b>
              {drivingPattern.weekday} {drivingPattern.timeslot}
            </b>
            에 <br /> 위험 운전 행동이 가장 많이 발생했습니다.
          </Styled.BehaviorTitle>
          <PatternChart data={drivingPattern.chart} />
          <Styled.InsightText>{drivingPattern.comment}</Styled.InsightText>
        </div>

        {/* == 주행 차트2 ==  */}
        <div>
          <Styled.BehaviorTitle>
            위험 운전 행동이 이전 리포트 대비 <br />
            <b>
              {compare.incdec > 0
                ? `${compare.incdec}% 증가했습니다.`
                : compare.incdec < 0
                  ? `${Math.abs(compare.incdec)}% 감소했습니다.`
                  : '변화가 없습니다.'}
            </b>
          </Styled.BehaviorTitle>
          <ComparisonChart data={compare.chart} />
        </div>
      </Styled.BehaviorWrapper>
    </Styled.Section>
  );
}
