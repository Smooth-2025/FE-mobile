import { theme } from '@/styles/theme';
import * as Styled from '@/components/report/charts/ComparisonChart.styles';
import type { DrivingComparChart } from '@/store/report/type';

type ItemProps = {
  title: string;
  prevCount: number;
  currCount: number;
  color?: string;
};

function ComparisonItem({
  title,
  prevCount,
  currCount,
  color = theme.colors.primary500,
}: ItemProps) {
  const max = Math.max(prevCount, currCount, 1);
  const prevPercent = (prevCount / max) * 100;
  const currPercent = (currCount / max) * 100;

  return (
    <Styled.Item>
      <Styled.Title>{title}</Styled.Title>
      <Styled.Row>
        <Styled.Label>이전 리포트</Styled.Label>
        <Styled.BarWrapper>
          <Styled.Bar percent={prevPercent} color={theme.colors.neutral100} />
        </Styled.BarWrapper>
        <Styled.Value>{prevCount}회</Styled.Value>
      </Styled.Row>

      <Styled.Row>
        <Styled.Label>이번 리포트</Styled.Label>
        <Styled.BarWrapper>
          <Styled.Bar percent={currPercent} color={color} />
        </Styled.BarWrapper>
        <Styled.Value>{currCount}회</Styled.Value>
      </Styled.Row>
    </Styled.Item>
  );
}

export default function ComparisonChart({ data }: { data: DrivingComparChart }) {
  if (!data) return;

  const { hardBrake, rapidAccel, laneChange } = data;
  return (
    <Styled.ComparisonBox>
      <ComparisonItem
        title="급제동"
        prevCount={hardBrake.before ?? 0}
        currCount={hardBrake.current ?? 0}
      />
      <ComparisonItem
        title="급가속"
        prevCount={rapidAccel.before ?? 0}
        currCount={rapidAccel.current ?? 0}
      />
      <ComparisonItem
        title="차선 변경"
        prevCount={laneChange.before ?? 0}
        currCount={laneChange.current ?? 0}
      />
    </Styled.ComparisonBox>
  );
}
