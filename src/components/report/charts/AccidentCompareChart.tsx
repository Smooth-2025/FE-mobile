import { theme } from '@/styles/theme';
import { formatDuration } from '@/utils/timeUtils';
import * as Styled from '@/components/report/charts/AccidentCompareChart.styles';
import type { BenchmarkChart } from '@/store/report/type';

export default function AccidentCompareChart({ data }: { data: BenchmarkChart }) {
  if (!data) return;

  const { labels, valuesSec } = data;

  const max = Math.max(valuesSec[0], valuesSec[1], 1);
  const avgPercent = (valuesSec[0] / max) * 100;
  const myPercent = (valuesSec[1] / max) * 100;

  if (!data || valuesSec.length < 2) return null;

  return (
    <Styled.ChartWrapper>
      <Styled.ChartContent>
        <Styled.TopBox>
          <Styled.ValueTop>{formatDuration(valuesSec[0] ?? 0)}</Styled.ValueTop>
          <Styled.ValueTop>{formatDuration(valuesSec[1] ?? 0)}</Styled.ValueTop>
        </Styled.TopBox>

        <Styled.BarBox>
          <Styled.BarWrapperVertical>
            <Styled.BarVertical percent={avgPercent} barColor={theme.colors.neutral200} />
          </Styled.BarWrapperVertical>
          <Styled.BarWrapperVertical>
            <Styled.BarVertical percent={myPercent} barColor={theme.colors.primary500} />
          </Styled.BarWrapperVertical>
        </Styled.BarBox>

        <Styled.LabelBox>
          {labels.map((label, idx) => {
            return <Styled.LabelBottom key={idx}>{label}</Styled.LabelBottom>;
          })}
        </Styled.LabelBox>
      </Styled.ChartContent>
    </Styled.ChartWrapper>
  );
}
