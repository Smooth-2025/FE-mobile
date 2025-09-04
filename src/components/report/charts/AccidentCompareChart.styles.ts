import styled from '@emotion/styled';

export const ChartWrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: auto;
  border: 1px solid ${({ theme }) => theme.colors.neutral200};
  border-radius: 10px;
  gap: 20px;
  margin-top: 20px;
  padding: 20px 0;
`;
export const ChartContent = styled.div`
  width: 70%;
  display: flex;
  flex-direction: column;
  align-items: center;
  row-gap: 10px;
`;
export const TopBox = styled.div`
  display: flex;
  justifycontent: space-around;
  width: 100%;
`;
export const BarBox = styled.div`
  display: flex;
  justify-content: space-around;
  gap: 10px;
  width: 100%;
  position: relative;
  height: 80px;
  border-top: 1px solid ${({ theme }) => theme.colors.neutral200};
  border-bottom: 1px solid ${({ theme }) => theme.colors.neutral200};
  align-items: flex-end;
  overflow: hidden;

  /* 중간선 (50%) */
  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 0;
    right: 0;
    height: 1px;
    background-color: ${({ theme }) => theme.colors.neutral200};
  }
`;
export const LabelBox = styled.div`
  display: flex;
  justify-content: space-around;
  width: 100%;
`;

export const ValueTop = styled.span`
  flex: 1;
  text-align: center;
  font-size: ${({ theme }) => theme.fontSize[14]};
  font-weight: 500;
  color: ${({ theme }) => theme.colors.neutral600};
  margin-bottom: 4px;
`;

export const BarWrapperVertical = styled.div`
  width: 30%;
  height: 80px;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  justify-content: flex-end;
  z-index: 1;
`;

export const BarVertical = styled.div<{ percent: number; barColor: string }>`
  width: 100%;
  height: ${({ percent }) => percent}%;
  background-color: ${({ barColor }) => barColor};
  border-radius: 12px 12px 0 0;
  transition: height 0.3s ease;
`;

export const LabelBottom = styled.span`
  flex: 1;
  text-align: center;
  font-size: ${({ theme }) => theme.fontSize[12]};
  color: ${({ theme }) => theme.colors.neutral500};
  margin-top: 4px;
`;
