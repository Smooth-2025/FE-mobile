import styled from '@emotion/styled';
import { theme } from '@/styles/theme';

export const ReportItem = styled.div`
  background-color: ${theme.colors.neutral50};
  border-radius: ${theme.borderRadius.sm}px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const ReportRow = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding: 4px 0;

  &:last-child {
    padding-bottom: 0;
  }

  &:first-of-type {
    padding-top: 0;
  }
`;

export const ReportLabel = styled.span`
  font-size: 14px;
  font-weight: 400;
  color: ${theme.colors.neutral500};
  min-width: 70px;
  flex-shrink: 0;
  margin-right: 16px;
`;

export const ReportValue = styled.span`
  font-size: 14px;
  font-weight: 400;
  color: ${theme.colors.neutral700};
  flex: 1;
  text-align: left;
`;
