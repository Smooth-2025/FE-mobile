import styled from '@emotion/styled';
import { theme } from '@/styles/theme';

export const FallbackContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  background-color: #1a1a1a;
  overflow: hidden;
`;

export const Wrapper = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  padding: 32px;
  background-color: ${theme.colors.danger600};
  border-radius: 12px;
  color: ${theme.colors.white};
  font-family: Arial, sans-serif;
  max-width: 500px;
  text-align: center;
  z-index: 1000;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

export const Icon = styled.div`
  font-size: ${({ theme }) => theme.fontSize[40]};
  margin-bottom: 8px;
`;

export const Title = styled.div`
  font-weight: bold;
  font-size: ${({ theme }) => theme.fontSize[20]};
  margin-bottom: 8px;
`;

export const Message = styled.div`
  font-size: ${({ theme }) => theme.fontSize[16]};
  line-height: 1.5;
  margin-bottom: 12px;
`;

export const Suggestion = styled.div`
  font-size: ${({ theme }) => theme.fontSize[14]};
  opacity: 0.9;
  font-style: italic;
  margin-bottom: 20px;
`;

export const Details = styled.details`
  width: 100%;
  margin-bottom: 16px;
  font-size: ${({ theme }) => theme.fontSize[12]};
  opacity: 0.8;
`;

export const Summary = styled.summary`
  cursor: pointer;
  margin-bottom: 8px;
  font-weight: bold;
`;

export const DetailBox = styled.div`
  background-color: rgba(0, 0, 0, 0.3);
  padding: 12px;
  border-radius: 6px;
  text-align: left;
  font-family: monospace;
  white-space: pre-wrap;
  word-break: break-word;
`;

export const Actions = styled.div`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  justify-content: center;
`;

export const RetryButton = styled.button`
  padding: 10px 20px;
  background-color: ${({ theme }) => theme.colors.white};
  color: ${({ theme }) => theme.colors.danger600};
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: bold;
  font-size: 14px;
  transition: all 0.2s ease;

  &:hover,
  &:focus {
    background-color: ${({ theme }) => theme.colors.white};
  }
`;

export const RefreshButton = styled.button`
  padding: 10px 20px;
  background-color: rgba(255, 255, 255, 0.2);
  color: ${({ theme }) => theme.colors.white};
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 6px;
  cursor: pointer;
  font-weight: bold;
  font-size: 14px;
  transition: all 0.2s ease;

  &:hover,
  &:focus {
    background-color: rgba(255, 255, 255, 0.3);
  }
`;
