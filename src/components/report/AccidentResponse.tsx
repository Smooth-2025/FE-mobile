import * as Styled from '@/components/report/AccidentResponse.styles';
import AccidentCompareChart from './charts/AccidentCompareChart';

export default function AccidentResponse() {
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
              <span>0 건</span>
            </li>
            <li>
              <span>평균 반응 시간</span>
              <span>0 초</span>
            </li>
            <li>
              <span>감속/정지 반응비율</span>
              <span>0 %</span>
            </li>
            <li>
              <span>우회 비율</span>
              <span>0 %</span>
            </li>
          </Styled.AccidentInfoList>
        </div>
        {/* == 주행차트 ==  */}
        <div>
          <Styled.AccidentTitle>
            평균 사용자보다
            <b> 1초 </b>
            <br />더 빠르게 반응하고 있어요!
          </Styled.AccidentTitle>
          <div>
            <AccidentCompareChart avgUser={0} myResponse={0} />
          </div>
        </div>
      </Styled.AccidentWrapper>
    </Styled.Section>
  );
}
