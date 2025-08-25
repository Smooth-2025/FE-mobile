import type { DrivingFrame } from './dumiData';

type Props = {
  currentIndex: number; // 현재 프레임 번호 (0-based)
  total: number; // 전체 프레임 수
  ego: DrivingFrame['ego'] | null;
  neighbors: DrivingFrame['neighbors'];
  timestamp: string | null;
  humanTime: (iso: string) => string;
};
const SCALE = { forward: 10, lateral: 1 };

// 각도 -π~π 정규화 (한바퀴 이상 회전 방지)
function normAngle(rad: number): number {
  const x = ((((rad + Math.PI) % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI)) - Math.PI;
  return x;
}

// 에고 기준 상대 → three.js 화면 좌표
// CARLA: x=앞/뒤, y=좌/우  →  three.js: z=앞, x=좌/우
function carlaRelativeToScene(
  ego: { x: number; y: number; yaw: number },
  other: { x: number; y: number },
  scale: { forward: number; lateral: number },
): { sx: number; sz: number } {
  const dx = other.x - ego.x;
  const dy = other.y - ego.y;

  const cos = Math.cos(-ego.yaw);
  const sin = Math.sin(-ego.yaw);
  const relForward = dx * cos - dy * sin; // +앞
  const relLateral = dx * sin + dy * cos; // +좌
  return {
    sx: relLateral * scale.lateral, // 화면 x
    sz: -relForward * scale.forward, // 화면 z
  };
}

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

      {ego && timestamp && (
        <div style={{ opacity: 0.95, marginBottom: 6 }}>
          <span style={{ color: '#9cdcff' }}>
            <b>에고</b>
          </span>{' '}
          x: {ego.pose.x.toFixed(2)} , y: {ego.pose.y.toFixed(2)} · yaw: {ego.pose.yaw.toFixed(3)}{' '}
          rad
          <div style={{ opacity: 0.9 }}>
            ⏱ ts(local): {humanTime(timestamp)} · ts(raw): {timestamp}
          </div>
        </div>
      )}

      {neighbors[0] && ego && timestamp && (
        <div style={{ opacity: 0.95 }}>
          <div>
            <span style={{ color: '#ff9' }}>
              <b>상대</b>
            </span>{' '}
            x: {neighbors[0].pose.x.toFixed(2)} , y: {neighbors[0].pose.y.toFixed(2)} · yaw:{' '}
            {neighbors[0].pose.yaw.toFixed(3)} rad
            <div style={{ opacity: 0.9 }}>
              ⏱ ts(local): {humanTime(timestamp)} · ts(raw): {timestamp}
            </div>
          </div>
          {(() => {
            const rel = carlaRelativeToScene(
              { x: ego.pose.x, y: ego.pose.y, yaw: ego.pose.yaw },
              { x: neighbors[0].pose.x, y: neighbors[0].pose.y },
              SCALE,
            );
            const relYaw = normAngle(neighbors[0].pose.yaw - ego.pose.yaw);
            return (
              <div>
                <span style={{ color: '#ffd27a' }}>
                  <b>상대(에고 기준 화면)</b>
                </span>{' '}
                x: {rel.sx.toFixed(2)} , z: {rel.sz.toFixed(2)} · relYaw: {relYaw.toFixed(3)} rad
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
}
