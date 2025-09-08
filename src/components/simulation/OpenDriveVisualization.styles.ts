import styled from '@emotion/styled';

export const Container = styled.div<{ width: string | number; height: string | number }>`
  position: relative;
  width: ${({ width }) => (typeof width === 'number' ? `${width}px` : width)};
  height: ${({ height }) => (typeof height === 'number' ? `${height}px` : height)};
  background-color: #1a1a1a;
  overflow: hidden;
`;

export const EmptyState = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: ${({ theme }) => theme.colors.white};
  font-family: Arial, sans-serif;
  text-align: center;
`;

export const ErrorMessage = styled.div`
  margin-top: 16px;
  font-size: ${({ theme }) => theme.fontSize[14]};
  opacity: 0.8;
`;

export const WarningBox = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: ${({ theme }) => theme.colors.accent_orange};
  color: #000;
  padding: 8px 12px;
  border-radius: 4px;
  font-size: ${({ theme }) => theme.fontSize[12]};
  max-width: 300px;
  z-index: 1000;
`;

export const WarningTitle = styled.div`
  font-weight: bold;
  margin-bottom: 4px;
`;

export const WarningItem = styled.div`
  margin-bottom: 2px;
`;

export const WarningMore = styled.div`
  font-style: italic;
`;
