import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';

export const DrivingCardContainer = styled.div<{ $status: 'PROCESSING' | 'COMPLETED' }>`
  background: ${({ $status, theme }) =>
    $status === 'PROCESSING' ? theme.colors.white : theme.colors.white};
  border: 1px solid
    ${({ $status, theme }) => ($status === 'PROCESSING' ? 'none' : theme.colors.neutral300)};
  border-radius: 10px;
  padding: 24px 20px;
  margin-bottom: 10px;
  display: flex;
  flex-direction: column;
`;

export const MetricsSection = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px 30px;

  @media (max-width: 400px) {
    grid-template-columns: 1fr;
    gap: 12px;
  }
`;

export const MetricItem = styled.div`
  display: flex;
  align-items: center;
  color: ${({ theme }) => theme.colors.neutral600};
`;

export const Dot = styled.span<{ color: string }>`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: ${(props) => props.color};
  display: inline-block;
  margin-right: 6px;
`;

export const MetricLabel = styled.span`
  flex: 1;
  font-size: ${({ theme }) => theme.fontSize[14]};
`;

export const MetricValue = styled.span`
  font-size: ${({ theme }) => theme.fontSize[14]};
  margin-left: auto;
`;
export const TimeRow = styled.span`
  margin-top: 20px;
  font-size: ${({ theme }) => theme.fontSize[14]};
  color: ${({ theme }) => theme.colors.neutral500};
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
