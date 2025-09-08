import styled from '@emotion/styled';
import { theme } from '@/styles/theme';

export const ModalBackdrop = styled.div`
  @keyframes emergencyBlink {
    0%,
    50% {
      background: ${theme.colors.danger700};
    }
    51%,
    100% {
      background: ${theme.colors.black};
    }
  }

  position: fixed;
  inset: 0;
  background: ${theme.colors.danger700};
  z-index: 99999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  opacity: 0;
  transition: opacity 240ms ease;

  &[data-mounted='true'] {
    opacity: 1;
    animation: emergencyBlink 0.4s infinite;
  }
`;

export const AlertContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: ${theme.spacing.xl}px ${theme.spacing.lg}px ${theme.spacing.lg}px;
  background: ${theme.colors.white};
  border-radius: ${theme.borderRadius.lg}px;
  min-height: 380px;
  max-width: 350px;
  width: 100%;
  transform: scale(0.9);
  opacity: 0;
  transition: all 240ms ease;

  &[data-mounted='true'] {
    transform: scale(1);
    opacity: 1;
  }
`;

export const EmergencyBellImage = styled.img`
  width: 80px;
  height: 80px;
  margin-bottom: ${theme.spacing.lg}px;
`;

export const Title = styled.h2`
  font-size: ${theme.fontSize[24]};
  font-weight: bold;
  color: ${theme.colors.neutral600};
  margin-bottom: ${theme.spacing.md}px;
  text-align: center;
`;

export const Description = styled.p`
  font-size: ${theme.fontSize[16]};
  color: ${theme.colors.neutral400};
  text-align: center;
  line-height: 1.5;
  margin-bottom: ${theme.spacing.sm}px;
`;

export const TimerSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: ${theme.spacing.lg}px 0 ${theme.spacing.xl}px;
`;

export const TimerLabel = styled.p`
  font-size: ${theme.fontSize[16]};
  color: ${theme.colors.danger600};
  font-weight: 500;
  margin-bottom: ${theme.spacing.md}px;
  text-align: center;
`;

export const Timer = styled.div`
  font-size: ${theme.fontSize[36]};
  font-weight: bold;
  color: ${theme.colors.danger600};
  text-align: center;
`;

export const ButtonContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.md}px;
  align-items: center;
`;

export const HighlightText = styled.span`
  font-weight: 600;
  color: ${theme.colors.neutral500};
`;

export const CancelButton = styled.button`
  width: 50%;
  height: 56px;
  background: transparent;
  color: ${theme.colors.neutral400};
  font-size: ${theme.fontSize[16]};
  font-weight: 500;
  border: none;
  border-bottom: 1px solid ${theme.colors.neutral300};
  border-radius: ${theme.borderRadius.sm}px;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-top: ${theme.spacing.xs}px;
  padding-top: 20px;

  &:hover {
    background: ${theme.colors.neutral50};
    border-bottom-color: ${theme.colors.neutral400};
  }

  &:active {
    background: ${theme.colors.neutral100};
  }
`;
