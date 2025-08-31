import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { theme } from '@/styles/theme';
import { Button } from '@/components/common/Button';
import emergencyBell from '@/assets/images/emergency-bell.png';
import * as Styled from './EmergencyCallAlert.styles';

interface EmergencyCallAlertProps {
  isOpen: boolean;
  onClose: () => void;
  onEmergencyCall?: () => void;
  onManualEmergencyCall?: () => void;
  countdownSeconds?: number;
}

export default function EmergencyCallAlert({
  isOpen,
  onClose,
  onEmergencyCall,
  onManualEmergencyCall,
  countdownSeconds = 30,
}: EmergencyCallAlertProps) {
  const [remainingTime, setRemainingTime] = useState(countdownSeconds);
  const [mounted, setMounted] = useState(false);
  const hasCalledTimeoutRef = useRef(false);

  useEffect(() => {
    if (!isOpen) {
      setRemainingTime(countdownSeconds);
      setMounted(false);
      hasCalledTimeoutRef.current = false;
      return;
    }

    const rafId = requestAnimationFrame(() => setMounted(true));

    const timer = setInterval(() => {
      setRemainingTime((prev) => {
        if (prev === 1 && !hasCalledTimeoutRef.current) {
          hasCalledTimeoutRef.current = true;
          onEmergencyCall?.();
          return 0;
        }
        return prev > 0 ? prev - 1 : 0;
      });
    }, 1000);

    return () => {
      cancelAnimationFrame(rafId);
      clearInterval(timer);
    };
  }, [isOpen, countdownSeconds, onEmergencyCall]);

  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isOpen]);

  const handleEmergencyCall = () => {
    onManualEmergencyCall?.();
  };

  const handleCancel = () => {
    onClose();
  };

  if (!isOpen) return null;

  const modalRoot = document.getElementById('modal-root') || document.body;

  return createPortal(
    <Styled.ModalBackdrop data-mounted={mounted ? 'true' : 'false'}>
      <Styled.AlertContent data-mounted={mounted ? 'true' : 'false'}>
        <Styled.EmergencyBellImage src={emergencyBell} alt="응급벨" />
        
        <Styled.Title>심각한 충돌이 감지되었습니다.</Styled.Title>
        
        <Styled.Description>운전자 상태 확인이 필요합니다.</Styled.Description>
        <Styled.Description>
          <Styled.HighlightText>{remainingTime}초 이내</Styled.HighlightText>에 아래 버튼을 눌러 응답해주세요.
        </Styled.Description>

        <Styled.TimerSection>
          <Styled.TimerLabel>자동 신고까지 남은 시간</Styled.TimerLabel>
          <Styled.Timer>{remainingTime}초</Styled.Timer>
        </Styled.TimerSection>

        <Styled.ButtonContainer>
          <Button
            label="신고하기"
            onClick={handleEmergencyCall}
            bgColor={theme.colors.danger600}
            textColor={theme.colors.white}
            size="lg"
            style={{ height: '56px' }}
          />
          <Styled.CancelButton onClick={handleCancel}>
            괜찮습니다.
          </Styled.CancelButton>
        </Styled.ButtonContainer>
      </Styled.AlertContent>
    </Styled.ModalBackdrop>,
    modalRoot
  );
}