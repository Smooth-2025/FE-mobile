import * as Styled from '@/components/report/DrivingSummary.styles';
import { useGetDrivingSummaryQuery } from '@/store/report/reportApi';
import { formatDuration } from '@/utils/timeUtils';

//주행정보
export default function DrivingSummary({ reportId }: { reportId: number }) {
  const { data, isLoading, isError } = useGetDrivingSummaryQuery({ reportId });

  if (isLoading) return <>isLoading...</>;
  if (isError) {
    return;
  }

  return (
    <Styled.Section>
      <Styled.SectionTitle>주행 정보</Styled.SectionTitle>
      {/* == 주행 차트 ==  */}
      <Styled.SummaryBox>
        <Styled.SummaryTitle>
          15회 운전 기간동안 총 <b>{data?.totalDistanceKm ?? 0}km</b>를 <br /> 운전했어요!
        </Styled.SummaryTitle>
        <Styled.DateText>
          {data?.periodStart} - {data?.periodEnd}
        </Styled.DateText>
        <Styled.InfoList>
          <li>
            <span>평균 주행 시간</span>
            <span>{formatDuration(data?.averageDurationSec ?? 0)}</span>
          </li>
          <li>
            <span>평균 주행 거리</span>
            <span>{data?.averageDistanceKm ?? 0}km</span>
          </li>
          <li>
            <span>평균 속도</span>
            <span>{data?.averageSpeedKmh ?? 0}km/h</span>
          </li>
          <li>
            <span>정속 주행률</span>
            <span>{data?.averageCruiseRatio ?? 0}%</span>
          </li>
        </Styled.InfoList>
      </Styled.SummaryBox>
    </Styled.Section>
  );
}
