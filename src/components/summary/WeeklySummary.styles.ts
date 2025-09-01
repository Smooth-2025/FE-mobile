import styled from '@emotion/styled';

export const WeeklySummaryContainer = styled.section`
  background: ${({ theme }) => theme.colors.white};
  border: 1px solid ${({ theme }) => theme.colors.neutral300};
  padding: 24px 20px;
  margin: 0px 18px;
  border-radius: 10px;
`;

export const Title = styled.p`
  font-weight: 600;
  font-size: ${({ theme }) => theme.fontSize[16]};
  color: ${({ theme }) => theme.colors.neutral600};
  margin-bottom: 18px;
`;

// == Placeholder ==
export const P_Container = styled.div`
  background: ${({ theme }) => theme.colors.white};
  border: 1px solid ${({ theme }) => theme.colors.neutral300};
  margin: 0px 18px;
  padding: 24px 20px;
  border-radius: 10px;
`;

export const P_TitleBox = styled.div`
  width: 100%;
  height: 20px;
  min-height: 30px;
  max-height: 50px;
  align-items: center;
  margin-bottom: 18px;
`;

export const P_MetricWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: auto auto;
  gap: 12px 30px;

  @media (max-width: 400px) {
    grid-template-columns: 1fr;
    grid-template-rows: auto;
    gap: 12px;
  }
`;

export const P_MetricItem = styled.div`
  min-height: 15px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;
