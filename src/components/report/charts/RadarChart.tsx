import ReactApexChart from 'react-apexcharts';
import { theme } from '@/styles/theme';
import type { ApexOptions } from 'apexcharts';

type RadarChartProps = {
  categories: string[];
  series: { name: string; data: number[] }[];
};

export default function RadarChart({ categories, series }: RadarChartProps) {
  const options: ApexOptions = {
    chart: {
      type: 'radar',
      toolbar: { show: false },
    },
    xaxis: {
      categories,
    },
    yaxis: {
      show: false,
      tickAmount: 2,
    },
    plotOptions: {
      radar: {
        polygons: {
          strokeColors: theme.colors.neutral200,
        },
      },
    },
    stroke: {
      width: 2,
      curve: 'smooth',
      colors: [theme.colors.primary500],
    },
    fill: {
      opacity: 0.2,
      colors: [theme.colors.primary500],
    },
    markers: {
      size: 0,
    },
    grid: {
      show: false,
    },
    legend: {
      show: false,
    },
  };

  return <ReactApexChart options={options} series={series} type="radar" height={300} />;
}
