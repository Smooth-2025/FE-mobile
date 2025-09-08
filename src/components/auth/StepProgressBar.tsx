import styled from '@emotion/styled';
import { theme } from '@styles/theme';

const StepContainer = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 24px;
`;

const StepItem = styled.div<{ isCompleted: boolean; isActive: boolean }>`
  flex: 1;
  height: 4px;
  border-radius: 2px;
  background-color: ${({ isCompleted, isActive }) =>
    isCompleted || isActive ? theme.colors.primary600 : theme.colors.neutral300};
  transition: background-color 0.3s ease;
`;

interface StepProgressBarProps {
  currentStep: number;
  totalSteps?: number;
}

export function StepProgressBar({ currentStep, totalSteps = 4 }: StepProgressBarProps) {
  return (
    <StepContainer>
      {Array.from({ length: totalSteps }, (_, index) => {
        const stepNumber = index + 1;
        const isCompleted = stepNumber < currentStep;
        const isActive = stepNumber === currentStep;

        return <StepItem key={stepNumber} isCompleted={isCompleted} isActive={isActive} />;
      })}
    </StepContainer>
  );
}
