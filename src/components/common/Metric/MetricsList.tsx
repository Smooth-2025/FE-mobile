import * as styled from '@/components/common/Metric/MetricsList.styles';

type Metric = {
  color: string;
  label: string;
  value: string;
};

type PropsType = {
  metrics: Metric[];
};

export function MetricsList({ metrics }: PropsType) {
  return (
    <styled.MetricContainer>
      {metrics.map((m, idx) => (
        <styled.MetricItem key={idx}>
          <styled.Dot color={m.color} />
          <styled.MetricLabel>{m.label}</styled.MetricLabel>
          <styled.MetricValue>{m.value}</styled.MetricValue>
        </styled.MetricItem>
      ))}
    </styled.MetricContainer>
  );
}
