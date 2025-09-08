import styled from '@emotion/styled';
import { theme } from '@/styles/theme';

export const Wrapper = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  padding: 24px;
  background-color: rgba(0, 0, 0, 0.8);
  border-radius: 8px;
  color: white;
  font-family: Arial, sans-serif;
  z-index: 1000;
`;

export const Spinner = styled.div`
  width: 40px;
  height: 40px;
  border: 4px solid ${theme.colors.white};
  border-top: 4px solid ${theme.colors.primary600};
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

export const Text = styled.div`
  font-size: ${theme.fontSize[14]};
`;
