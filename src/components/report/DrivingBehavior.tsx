import * as Styled from '@/components/report/DrivingBehavior.styles';
import ComparisonChart from './charts/ComparisonChart';
import PatternChart from './charts/PatternChart';

export default function DrivingBehavior() {
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
                <span>2</span>회
              </p>
            </Styled.BehaviorItem>
            <Styled.BehaviorItem>
              <h4>급가속</h4>
              <p>
                <span>2</span>회
              </p>
            </Styled.BehaviorItem>
            <Styled.BehaviorItem>
              <h4>차선변경</h4>
              <p>
                <span>2</span>회
              </p>
            </Styled.BehaviorItem>
          </Styled.BehaviorList>
        </div>

        {/* == 주행 차트1 ==  */}
        <div>
          <Styled.BehaviorTitle>
            이번 주행에는 <b>일요일 밤(20~24시)</b>에 위험 운전 행동이 가장 많이 발생했습니다.
          </Styled.BehaviorTitle>
          <PatternChart />
          <Styled.InsightText>
            평일 저녁에는 급제동과 급회전이 늘어나는 패턴이 보여요! 퇴근길 운전 시 조금 더 여유 있는
            주행을 해보세요.
          </Styled.InsightText>
        </div>

        {/* == 주행 차트2 ==  */}
        <div>
          <Styled.BehaviorTitle>
            위험 운전 행동이 이전 리포트 대비 <br />
            <b>25% 감소</b>했습니다.
          </Styled.BehaviorTitle>
          <ComparisonChart />
        </div>
      </Styled.BehaviorWrapper>
    </Styled.Section>
  );
}
