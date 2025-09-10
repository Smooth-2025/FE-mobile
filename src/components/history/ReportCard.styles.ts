import { keyframes } from '@emotion/react';
import styled from '@emotion/styled';

export const ReportCardContainer = styled.div<{ $status: 'PROCESSING' | 'COMPLETED' }>`
  position: relative;
  border-radius: 10px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  background: ${({ $status, theme }) =>
    $status === 'PROCESSING' ? theme.colors.primary100 : theme.colors.primary100};
  border: 1px solid
    ${({ $status, theme }) =>
      $status === 'PROCESSING' ? theme.colors.primary100 : theme.colors.primary600};
`;

export const NotificationBadge = styled.div`
  position: absolute;
  top: 15px;
  right: 18px;
  width: 8px;
  height: 8px;
  background: ${({ theme }) => theme.colors.danger600};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1;
`;

export const ReportIcon = styled.img`
  width: 38px;
  height: 38px;
  border-radius: 8px;
  object-fit: cover;
  flex-shrink: 0;
`;

export const ReportTextBox = styled.div`
  flex: 1;
  min-width: 0;
`;

export const ReportTitle = styled.p`
  margin: 0;
  font-weight: 700;
  font-size: ${({ theme }) => theme.fontSize[14]};
  color: ${({ theme }) => theme.colors.neutral600};
`;

export const ReportSub = styled.p`
  margin: 4px 0 0;
  font-size: ${({ theme }) => theme.fontSize[14]};
  color: ${({ theme }) => theme.colors.neutral600};
`;

export const ProcessingText = styled.div`
  font-size: ${({ theme }) => theme.fontSize[14]};
  color: ${({ theme }) => theme.colors.neutral600};
  font-weight: 400;
`;
const pulseRing = keyframes`
  0% { transform: scale(1); opacity: 0.28; }
  70% { transform: scale(1.9); opacity: 0.12; }
  100% { transform: scale(2.3); opacity: 0; }
`;

export const ProcessingIndicator = styled.div`
  position: relative;
  width: 10px;
  height: 10px;
  margin-right: 20px;

  &::before,
  &::after {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 50%;
    background: ${({ theme }) => theme.colors.primary400};
    animation: ${pulseRing} 1.8s ease-out infinite;
    transform-origin: center;
  }

  & > span {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 5px;
    height: 5px;
    transform: translate(-50%, -50%);
    border-radius: 50%;
    background: ${({ theme }) => theme.colors.primary500};
    z-index: 1;
  }
`;
