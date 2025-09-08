import ReactApexChart from 'react-apexcharts';
import { theme } from '@/styles/theme';
import * as Styled from '@/components/report/charts/PatternChart.styles';
import type { ApexOptions } from 'apexcharts';
import type { DailyBehavior } from '@/store/report/type';

const DAYS = ['월', '화', '수', '목', '금', '토', '일'];
const TIMESLOT = ['새벽', '출근', '낮', '퇴근', '저녁'];
const TIMESLOT_RANGE: Record<string, string> = {
  새벽: '00시~06시',
  출근: '06시~09시',
  낮: '09시~18시',
  퇴근: '18시~21시',
  저녁: '21시~24시',
};

function transformToSeries(data: DailyBehavior[]): {
  series: ApexAxisChartSeries;
} {
  const rapidAccelData = data.map((d) => d.actions?.rapidAccel?.count ?? 0);
  const hardBrakeData = data.map((d) => d.actions?.hardBrake?.count ?? 0);
  const laneChangeData = data.map((d) => d.actions?.laneChange?.count ?? 0);
  return {
    series: [
      { name: '급가속', data: rapidAccelData },
      { name: '급제동', data: hardBrakeData },
      { name: '차선변경', data: laneChangeData },
    ],
  };
}

export default function PatternChart({ data }: { data: DailyBehavior[] }) {
  if (!data) return;

  const { series } = transformToSeries(data);

  const options: ApexOptions = {
    chart: {
      type: 'line',
      height: 350,
      toolbar: { show: false },
      offsetX: -10,
      offsetY: 0,
    },
    stroke: {
      curve: 'smooth',
      width: 3,
    },
    colors: [theme.colors.accent_green, theme.colors.accent_purple, theme.colors.accent_orange],
    xaxis: {
      categories: DAYS,
      labels: {
        style: { colors: theme.colors.neutral500, fontSize: theme.fontSize[12] },
      },
    },
    yaxis: {
      labels: {
        formatter: (val: number) => {
          return TIMESLOT[val] || '';
        },

        style: { colors: theme.colors.neutral500, fontSize: theme.fontSize[12] },
      },
    },
    grid: {
      strokeDashArray: 4,
    },
    tooltip: {
      shared: true,
      custom: ({ series, dataPointIndex }) => {
        const day = DAYS[dataPointIndex];
        const timeBlock = TIMESLOT_RANGE[TIMESLOT[dataPointIndex]];
        return RenderTooltip(day, timeBlock, series, dataPointIndex);
      },
    },
    legend: {
      show: false,
    },
  };

  function RenderTooltip(day: string, timeBlock: string, series: number[][], index: number) {
    return `
      <div style="padding:8px; font-size:12px;   font-weight: 400;">
        <b>${day}요일, ${timeBlock}</b>
        <div style="margin-top:6px; display:flex; flex-direction: column; gap:6px;">
          <div style="display:flex; justify-content:space-between; align-items:center; ">
            <span style="color:#3F9A3F;">● 급가속</span>
            <span>${series[0][index]}회</span>
          </div>
          <div style="display:flex; justify-content:space-between; align-items:center;">
            <span style="color:#806FDF;">● 급제동</span>
            <span>${series[1][index]}회</span>
          </div>
          <div style="display:flex; justify-content:space-between; align-items:center;">
            <span style="color:#EFA53A;">● 차선변경</span>
            <span>${series[2][index]}회</span>
          </div>
        </div>
      </div>
    `;
  }

  return (
    <Styled.PatternChartBox>
      <ReactApexChart options={options} series={series} type="line" height={250} />
    </Styled.PatternChartBox>
  );
}
