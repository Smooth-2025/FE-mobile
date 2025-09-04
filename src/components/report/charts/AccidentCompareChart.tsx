import { theme } from '@/styles/theme';
import * as Styled from '@/components/report/charts/AccidentCompareChart.styles';

type PropsType = {
  avgUser: number;
  myResponse: number;
};

export default function AccidentCompareChart({ avgUser = 0, myResponse = 0 }: PropsType) {
  const max = Math.max(avgUser, myResponse, 1);
  const avgPercent = (avgUser / max) * 100;
  const myPercent = (myResponse / max) * 100;

  return (
    <Styled.ChartWrapper>
      <Styled.ChartContent>
        <Styled.TopBox>
          <Styled.ValueTop>{avgUser}초</Styled.ValueTop>
          <Styled.ValueTop>{myResponse}초</Styled.ValueTop>
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
          <Styled.LabelBottom>일반 운전자</Styled.LabelBottom>
          <Styled.LabelBottom>내 주행</Styled.LabelBottom>
        </Styled.LabelBox>
      </Styled.ChartContent>
    </Styled.ChartWrapper>
  );
}
