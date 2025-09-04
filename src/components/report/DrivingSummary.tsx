import * as Styled from '@/components/report/DrivingSummary.styles';

//주행정보
export default function DrivingSummary() {
  return (
    <Styled.Section>
      <Styled.SectionTitle>주행 정보</Styled.SectionTitle>
      {/* == 주행 차트 ==  */}
      <Styled.SummaryBox>
        <Styled.SummaryTitle>
          15회 운전 기간동안 총 <b>26.6km</b>를 <br /> 운전했어요!
        </Styled.SummaryTitle>
        <Styled.DateText>2025.08.01 - 2025.08.24</Styled.DateText>
        <Styled.InfoList>
          <li>
            <span>평균 주행 시간</span>
            <span>3분 15초</span>
          </li>
          <li>
            <span>평균 주행 거리</span>
            <span>23.6km</span>
          </li>
          <li>
            <span>평균 속도</span>
            <span>42.3km/h</span>
          </li>
          <li>
            <span>정속 주행률</span>
            <span>8.4%</span>
          </li>
        </Styled.InfoList>
      </Styled.SummaryBox>
    </Styled.Section>
  );
}
