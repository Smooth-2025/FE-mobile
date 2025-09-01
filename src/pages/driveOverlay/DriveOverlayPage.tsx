import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import styled from '@emotion/styled';
import { selectAlerts } from '@/store/slices/alertSlice';
import AlertToast from '@/components/common/AlertToast/AlertToast';
import { useEmergencyHandler } from '@/hooks/useEmergencyHandler';
import EmergencyCallAlert from '@/components/emergency/EmergencyCallAlert';
import EmergencyReportedAlert from '@/components/emergency/EmergencyReportedAlert';
import DrivingSimulation from '@/components/simulation/DrivingSimulation';
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
  const {
    isEmergencyModalOpen,
    isReportedModalOpen,
    isTimeout,
    openEmergencyModal,
    handleManualEmergencyCall,
    handleTimeoutEmergencyCall,
    handleEmergencyModalClose,
    handleReportedModalClose,
  } = useEmergencyHandler();

  const DISPLAY_MS = 3500;

  const [active, setActive] = useState<ActiveItem[]>([]);
  const timersRef = useRef<Record<string, number>>({});
  const lastAlertIdRef = useRef<string>('');

  useEffect(() => {
    if (!alert || alert.id === lastAlertIdRef.current) return;
    lastAlertIdRef.current = alert.id;

    const { type, title, content } = alert;

    console.warn('🚨 DriveOverlayPage alert received:', { type, title, content });

    if (!isDisplayType(type)) {
      console.warn('❌ Type not in ALLOWED_TYPES:', type);
      return;
    }

    const alertId = `${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
    const alertItem: ActiveItem = { alertId, type, title, content, createdAt: Date.now() };

    setActive((prev) => [alertItem, ...prev]);

    // 'accident' 타입이고 내 사고일 때 119 신고 모달 표시
    if (type === 'accident') {
      console.warn('🚨 Opening emergency modal for accidentId:', alert.id);
      console.warn('🚨 Generated alertId for UI:', alertId);
      console.warn('🚨 Alert raw data:', alert.raw);
      openEmergencyModal(alert.id); // 실제 백엔드 accidentId 사용
    } else {
      console.warn('🚨 Not accident type, type is:', type);
    }

    // 개별 타이머: DISPLAY_MS 후 알림 제거 및 타이머 정리
    const timerId = window.setTimeout(() => {
      setActive((prev) => prev.filter((x) => x.alertId !== alertId));

      window.clearTimeout(timersRef.current[alertId]);
      delete timersRef.current[alertId];
    }, DISPLAY_MS);

    timersRef.current[alertId] = timerId;
  }, [alert, openEmergencyModal]);

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

      <EmergencyCallAlert
        isOpen={isEmergencyModalOpen}
        onClose={handleEmergencyModalClose}
        onEmergencyCall={handleTimeoutEmergencyCall}
        onManualEmergencyCall={handleManualEmergencyCall}
        countdownSeconds={30}
      />

      <EmergencyReportedAlert
        isOpen={isReportedModalOpen}
        onClose={handleReportedModalClose}
        isTimeout={isTimeout}
      />
      <DrivingSimulation />
    </OverlayContainer>
  );
}
