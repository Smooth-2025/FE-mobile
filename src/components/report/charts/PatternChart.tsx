import ReactApexChart from 'react-apexcharts';
import { theme } from '@/styles/theme';
import * as Styled from '@/components/report/charts/PatternChart.styles';
import type { ApexOptions } from 'apexcharts';

export default function PatternChart() {
  const series: ApexAxisChartSeries = [
    { name: '급가속', data: [2, 3, 4, 0, 0, 5, 4] },
    { name: '급제동', data: [1, 2, 2, 0, 0, 4, 3] },
    { name: '차선변경', data: [0, 1, 2, 2, 1, 3, 2] },
  ];

  const days = ['월', '화', '수', '목', '금', '토', '일'];

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
      categories: ['월', '화', '수', '목', '금', '토', '일'],
      labels: {
        style: { colors: theme.colors.neutral500, fontSize: theme.fontSize[12] },
      },
    },
    yaxis: {
      labels: {
        formatter: (val: number) => {
          const labels = ['새벽', '출근', '낮', '퇴근', '저녁'];
          return labels[val] || '';
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
        const day = days[dataPointIndex];
        return RenderTooltip(day, '20~22시', series, dataPointIndex);
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
