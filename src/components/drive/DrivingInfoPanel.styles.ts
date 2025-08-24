import styled from '@emotion/styled';

export const TopSection = styled.section`
  width: 100%;
  display: flex;
  flex-direction: column;
  padding: 24px 33px;
`;
export const InfoBoxContainer = styled.section`
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
