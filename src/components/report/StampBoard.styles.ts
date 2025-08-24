import styled from '@emotion/styled';

export const Wrapper = styled.section`
  padding: 24px 33px;
  background: ${({ theme }) => theme.colors.primary600};
  color: ${({ theme }) => theme.colors.white};
`;

export const TopSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const TitleBox = styled.div`
  margin-bottom: 20px;
`;

export const Badge = styled.p`
  display: inline-block;
  border-radius: 12px;
  font-weight: 700;
  font-size: ${({ theme }) => theme.fontSize[14]};
  color: ${({ theme }) => theme.colors.primary600};
  padding: 4px 10px;
  margin-bottom: 10px;
  background: ${({ theme }) => theme.colors.white};
`;

export const Title = styled.h3`
  font-size:  ${({ theme }) => `clamp(${theme.fontSize[16]}, 3.2vw, ${theme.fontSize[26]})`};
  font-size: 
  color: ${({ theme }) => theme.colors.white};
  line-height: 1.4;
`;

export const Character = styled.img`
  width: 86px;
  height: 102px;
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

export const BottomSection = styled.div`
  padding: 20px;
  border-radius: 10px;
  background: ${({ theme }) => theme.colors.white};
`;

export const StatusHeader = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 24px;
  font-size: 14px;
  color: ${({ theme }) => theme.colors.neutral600};
  p:first-of-type {
    font-size: ${({ theme }) => `clamp(${theme.fontSize[16]}, 3.2vw, ${theme.fontSize[20]})`};
    font-weight: 600;
  }
  p:last-of-type {
    font-size: ${({ theme }) => `clamp(${theme.fontSize[20]}, 3.2vw, ${theme.fontSize[24]})`};
  }
  span {
    color: ${({ theme }) => theme.colors.primary600};
  }
`;

export const StampGrid = styled.div`
  width: 95%;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(36px, 1fr));
  gap: clamp(8px, 2.4vw, 16px);
  justify-items: center;
  grid-template-columns: repeat(5, 1fr);
`;

export const StampCell = styled.div<{ filled?: boolean }>`
  width: 60%;
  aspect-ratio: 1 / 1;
  border-radius: 50%;
  display: grid;
  place-items: center;

  ${({ theme, filled }) =>
    filled
      ? `
        background: transparent;
        border: none;

        & > img {
          width: 100%;
          height: 100%;
          object-fit: contain;
          display: block;
        }
      `
      : `
        background: ${theme.colors.neutral200};
        border: 1px dashed ${theme.colors.neutral300};
        color: ${theme.colors.neutral400};
        font-size: clamp(${theme.fontSize[12]}, 3.2vw, ${theme.fontSize[20]});
      `}
`;
