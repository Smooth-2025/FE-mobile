import styled from '@emotion/styled';

export const Card = styled.div`
  width: 100%;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: ${({ theme }) => theme.colors.primary600};
  color: ${({ theme }) => theme.colors.white};
  padding: 12px 20px;
  border-radius: 10px;
  margin-top: 6px;
`;

export const StatItem = styled.div<{ isLast?: boolean }>`
  flex: 1;
  text-align: center;
  border-right: ${({ isLast, theme }) => (isLast ? 'none' : `1px solid ${theme.colors.white}33`)};
`;

export const Label = styled.p`
  font-size: ${({ theme }) => theme.fontSize[12]};
  font-weight: 600;
  margin-bottom: 8px;
`;

export const Value = styled.p`
  font-size: ${({ theme }) => theme.fontSize[12]};
`;
