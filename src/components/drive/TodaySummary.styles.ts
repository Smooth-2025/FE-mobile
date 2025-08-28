import styled from '@emotion/styled';

export const TodaySummaryContainer = styled.section`
  width: 100%;
  display: flex;
  flex-direction: column;
  padding: 0px 18px;
`;
export const InfoWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const InfoBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;
export const Title = styled.p`
  font-weight: 700;
  font-size: ${({ theme }) => theme.fontSize[16]};
  color: ${({ theme }) => theme.colors.neutral600};
`;
export const Subtitle = styled.p`
  font-size: ${({ theme }) => theme.fontSize[14]};
  color: ${({ theme }) => theme.colors.neutral500};
`;

export const Character = styled.img`
  width: 89px;
  height: 99px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px;
  img {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
  }
`;
// 주행 요약카드
export const StatsCardWrapper = styled.div`
  width: 100%;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: ${({ theme }) => theme.colors.primary600};
  color: ${({ theme }) => theme.colors.white};
  padding: 12px;
  border-radius: 10px;
  margin-top: 6px;
`;

export const StatsBox = styled.div<{ isLast?: boolean }>`
  flex: 1;
  text-align: center;
  border-right: ${({ isLast, theme }) => (isLast ? 'none' : `1px solid ${theme.colors.white}33`)};
`;

export const StatsLabel = styled.p`
  font-size: ${({ theme }) => theme.fontSize[14]};
  font-weight: 500;
  margin-bottom: 8px;
`;

export const StatsValue = styled.p`
  font-size: ${({ theme }) => theme.fontSize[14]};
`;

// == Placeholder ==
export const P_Container = styled.div`
  width: 100%;
  height: 200px;
  display: flex;
  flex-direction: column;
  padding: 20px 18px 0px;
`;

export const P_InfoBox = styled.div`
  display: flex;
  justify-content: space-between;
`;

export const P_Info = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  justify-content: flex-start;
  width: 100%;
  height: 100%;
  display: flex;
`;

export const P_ImageBox = styled.div`
  width: 80px;
  height: 80px;
  margin: 0 auto;
`;

export const P_CardBox = styled.div`
  width: 100%;
  height: 50%;
  display: flex;
  background: ${({ theme }) => theme.colors.white};
  color: ${({ theme }) => theme.colors.white};
  padding: 12px;
  gap: 10px;
  border-radius: 10px;
  margin-top: 12px;
`;

export const P_Box = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
  flex: 1;
  gap: 10px;
`;
