import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import styled from '@emotion/styled';
import { selectAlerts } from '@/store/slices/alertSlice';
import AlertToast from '@/components/common/AlertToast/AlertToast';
import DrivingSimulation from '@/components/driving/DrivingSimulation';
import type { AlertType as StoreAlertType } from '@/store/websocket/types';

const ALLOWED_TYPES = ['accident-nearby', 'obstacle', 'pothole', 'accident'] as const;
type DisplayAlertType = (typeof ALLOWED_TYPES)[number];

function isDisplayType(t: StoreAlertType | string): t is DisplayAlertType {
  return (ALLOWED_TYPES as readonly string[]).includes(t as string);
}

const OverlayContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  background: ${({ theme }) => theme.colors.white};
  z-index: 9999;
  display: flex;
  flex-direction: column;
`;

type AlertDisplay = {
  type: DisplayAlertType;
  title?: string;
  content?: string;
};
type ActiveItem = AlertDisplay & { alertId: string; createdAt: number };

export default function DriveOverlayPage() {
  const alert = useSelector(selectAlerts);

  const DISPLAY_MS = 3500;

  const [active, setActive] = useState<ActiveItem[]>([]);
  const timersRef = useRef<Record<string, number>>({});

  useEffect(() => {
    if (!alert) return;
    const { type, title, content } = alert;

    if (!isDisplayType(type)) return;

    const alertId = `${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
    const alertItem: ActiveItem = { alertId, type, title, content, createdAt: Date.now() };

    setActive((prev) => [alertItem, ...prev]);

    // 개별 타이머: DISPLAY_MS 후 알림 제거 및 타이머 정리
    const timerId = window.setTimeout(() => {
      setActive((prev) => prev.filter((x) => x.alertId !== alertId));

      window.clearTimeout(timersRef.current[alertId]);
      delete timersRef.current[alertId];
    }, DISPLAY_MS);

    timersRef.current[alertId] = timerId;
  }, [alert]);

  useEffect(() => {
    return () => {
      Object.values(timersRef.current).forEach((t) => window.clearTimeout(t));
      timersRef.current = {};
    };
  }, []);

  return (
    <OverlayContainer>
      {active.map((item, idx) => (
        <div
          key={item.alertId}
          style={
            {
              pointerEvents: 'auto',
              '--stack-offset': `${idx * 88}px`,
              marginBottom: '8px',
            } as React.CSSProperties
          }
        >
          <AlertToast
            type={item.type}
            title={item.title}
            content={item.content ?? ''}
            position="top"
          />
        </div>
      ))}
      <DrivingSimulation />
    </OverlayContainer>
  );
}
