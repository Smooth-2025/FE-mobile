import styled from '@emotion/styled';

export const ComparisonChartBox = styled.div`
  border-color: ${({ theme }) => theme.colors.neutral600};
  border-radius: 10px;
  padding: 16px;
`;

export const ComparisonBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 30px;
  padding: 16px;
  border: 1px solid ${({ theme }) => theme.colors.neutral200};
  border-radius: 12px;
  margin-top: 14px;
`;

export const Item = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const Title = styled.h4`
  font-size: ${({ theme }) => theme.fontSize[14]};
  font-weight: 600;
`;

export const Row = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const Label = styled.span`
  font-size: ${({ theme }) => theme.fontSize[14]};
  width: 70px;
`;

export const BarWrapper = styled.div`
  flex: 1;
  border-radius: 0px 5px 5px 0px;
  height: 20px;
  overflow: hidden;
`;

interface BarProps {
  percent: number;
  color: string;
}
export const Bar = styled.div<BarProps>`
  width: ${({ percent }) => percent}%;
  height: 100%;
  background: ${({ color }) => color};
  border-radius: 0px 5px 5px 0px;
`;

export const Value = styled.span`
  font-size: ${({ theme }) => theme.fontSize[14]};
  font-weight: 600;
  color: ${({ theme }) => theme.colors.neutral600};
  min-width: 40px;
  text-align: right;
`;
