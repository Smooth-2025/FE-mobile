import * as styled from '@components/drive/DriveStatsCard.styles';

export default function DriveStatsCard() {
  const stats = [
    { label: '정속 주행률', value: '0%' },
    { label: '주행시간', value: '0분' },
    { label: '주행거리', value: '0km' },
  ];

  return (
    <styled.Card>
      {stats.map((s, i) => (
        <styled.StatItem key={s.label} isLast={i === stats.length - 1}>
          <styled.Label>{s.label}</styled.Label>
          <styled.Value>{s.value}</styled.Value>
        </styled.StatItem>
      ))}
    </styled.Card>
  );
}
