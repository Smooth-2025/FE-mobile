import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { theme } from '@/styles/theme';
import { Button } from '@/components/common/Button';
import emergencyBell from '@/assets/images/emergency-bell.png';
import * as Styled from './EmergencyCallAlert.styles';

interface EmergencyReportedAlertProps {
  isOpen: boolean;
  onClose: () => void;
  isTimeout?: boolean;
}

export default function EmergencyReportedAlert({
  isOpen,
  onClose,
  isTimeout = false,
}: EmergencyReportedAlertProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setMounted(false);
      return;
    }

    const rafId = requestAnimationFrame(() => setMounted(true));

    return () => {
      cancelAnimationFrame(rafId);
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isOpen]);

  const handleConfirm = () => {
    onClose();
  };

  if (!isOpen) return null;

  const modalRoot = document.getElementById('modal-root') || document.body;

  return createPortal(
    <Styled.ModalBackdrop
      data-mounted={mounted ? 'true' : 'false'}
      style={{
        background: theme.colors.black_a60,
        animation: 'none',
      }}
    >
      <Styled.AlertContent data-mounted={mounted ? 'true' : 'false'}>
        <Styled.EmergencyBellImage src={emergencyBell} alt="응급벨" style={{ marginTop: '30px' }} />

        <Styled.Title style={{ marginTop: '20px' }}>
          <span style={{ color: theme.colors.danger600 }}>자동 신고</span>가 접수되었습니다.
        </Styled.Title>

        {isTimeout && (
          <Styled.Description style={{ marginTop: '15px' }}>
            30초 간 반응이 없어 자동신고로
            <br />
            접수되었습니다.
          </Styled.Description>
        )}
        <Styled.Description style={{ marginTop: '15px' }}>
          빠르게 도움을 요청 중입니다.
        </Styled.Description>

        <Styled.ButtonContainer style={{ marginTop: '60px' }}>
          <Button
            label="확인"
            onClick={handleConfirm}
            bgColor={theme.colors.danger600}
            textColor={theme.colors.white}
            size="lg"
            style={{ height: '56px' }}
          />
        </Styled.ButtonContainer>
      </Styled.AlertContent>
    </Styled.ModalBackdrop>,
    modalRoot,
  );
}
