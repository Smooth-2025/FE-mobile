import type { DrivingFrame } from './dumiData';

type Props = {
  currentIndex: number; // 현재 프레임 번호
  total: number; // 전체 프레임 수
  ego: DrivingFrame['ego'] | null;
  neighbors: DrivingFrame['neighbors'];
  timestamp: string | null;
  humanTime: (iso: string) => string;
};

export default function DumiHUD({
  currentIndex,
  total,
  ego,
  neighbors,
  timestamp,
  humanTime,
}: Props) {
  return (
    <div
      style={{
        position: 'absolute',
        left: 12,
        bottom: 12,
        padding: '10px 12px',
        background: 'rgba(0,0,0,0.6)',
        color: '#e6f0ff',
        fontSize: 16,
        borderRadius: 10,
        lineHeight: 1.5,
        fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace',
        pointerEvents: 'none',
        maxWidth: 1300,
      }}
    >
      <div style={{ fontWeight: 700, marginBottom: 6 }}>
        📍 재생 {Math.min(currentIndex + 1, total)}/{total} · 주변 차량 {neighbors.length}대
      </div>

      {ego && (
        <div style={{ opacity: 0.95, marginBottom: 6 }}>
          <span style={{ color: '#9cdcff' }}>
            <b>에고</b>
          </span>{' '}
          userId: {ego.userId} · latitude: {ego.pose.latitude.toFixed(5)} , longitude:{' '}
          {ego.pose.longitude.toFixed(5)}
        </div>
      )}

      {neighbors.length > 0 && (
        <div style={{ opacity: 0.95, marginBottom: 6 }}>
          <span style={{ color: '#ff9' }}>
            <b>주변 차량</b>
          </span>
          {neighbors.map((neighbor) => (
            <div key={neighbor.userId}>
              userId: {neighbor.userId} · latitude: {neighbor.pose.latitude.toFixed(5)} , longitude:{' '}
              {neighbor.pose.longitude.toFixed(5)}
            </div>
          ))}
        </div>
      )}

      {timestamp && (
        <div style={{ opacity: 0.9 }}>
          ⏱ ts(local): {humanTime(timestamp)} · ts(raw): {timestamp}
        </div>
      )}
    </div>
  );
}
