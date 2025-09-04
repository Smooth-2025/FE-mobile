import styled from '@emotion/styled';

export const CharacterTraitsContainer = styled.section`
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin: 0px 18px;
  background: ${({ theme }) => theme.colors.white};
  border: 1px solid ${({ theme }) => theme.colors.neutral300};
  padding: 24px 20px;
  border-radius: 10px;
`;

export const Header = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

export const Subtitle = styled.p`
  font-size: ${({ theme }) => theme.fontSize[14]};
  color: ${({ theme }) => theme.colors.neutral500};
`;

export const Title = styled.h3`
  font-size: ${({ theme }) => theme.fontSize[18]};
  font-weight: 700;
  line-height: 1.4;
  color: ${({ theme }) => theme.colors.neutral700};

  strong {
    color: ${({ theme }) => theme.colors.neutral700};
  }
`;

export const Character = styled.img`
  display: block;
  width: clamp(100px, 24vw, 400px);
  height: auto;
  margin: 20px auto;
  object-fit: contain;
`;

export const Description = styled.p`
  padding: 14px 16px;
  border-radius: 12px;
  background: ${({ theme }) => theme.colors.neutral100};
  color: ${({ theme }) => theme.colors.neutral500};
  font-size: ${({ theme }) => theme.fontSize[14]};
  line-height: 1.6;
`;

export const ProgressSection = styled.section`
  display: flex;
  flex-direction: column;
  gap: 10px;
  border: 1px solid ${({ theme }) => theme.colors.neutral200};
  border-radius: 10px;
  padding: 14px 24px;
`;

export const ProgressText = styled.p`
  font-size: ${({ theme }) => theme.fontSize[14]};
  color: ${({ theme }) => theme.colors.neutral700};
  font-weight: 500;
`;

export const Highlight = styled.span`
  color: ${({ theme }) => theme.colors.primary600};
`;

export const ProgressTrack = styled.div`
  position: relative;
  padding: 40px 0px 0px;
`;

export const ProgressMarker = styled.div`
  position: absolute;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  top: 0;
`;

export const ProgressIcon = styled.img`
  width: 24px;
  height: 24px;
`;

export const ProgressKm = styled.span`
  font-size: ${({ theme }) => theme.fontSize[12]};
  color: ${({ theme }) => theme.colors.primary600};
  font-weight: 600;
`;

export const ProgressBar = styled.div`
  position: relative;
  height: 10px;
  border-radius: 999px;
  background: ${({ theme }) => theme.colors.neutral200};
  overflow: hidden;
  margin-top: 4px;
`;

export const ProgressFill = styled.div<{ percent: number }>`
  position: absolute;
  inset: 0 auto 0 0;
  width: ${({ percent }) => Math.max(0, Math.min(percent, 100))}%;
  background: ${({ theme }) => theme.colors.primary600};
  border-radius: 999px;
  transition: width 0.35s ease;
`;

export const ProgressScale = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: ${({ theme }) => theme.fontSize[12]};
  color: ${({ theme }) => theme.colors.neutral500};
`;

// == Placeholder ==
export const P_Container = styled.div`
  display: flex;
  gap: 20px;
  flex-direction: column;
  background: ${({ theme }) => theme.colors.white};
  border: 1px solid ${({ theme }) => theme.colors.neutral300};
  margin: 0px 18px;
  padding: 24px 20px;
  border-radius: 10px;
`;
export const P_TitleBox = styled.div`
  width: 100%;
  height: 70px;
  min-height: 60px;
  max-height: 100px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-items: flex-start
  margin-bottom: 18px;
`;

export const P_ImageWrapper = styled.div`
  width: 150px;
  height: 150px;
  margin: 0 auto;
`;
export const P_DescriptionBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
  height: 80px;
  margin: 0 auto;
  padding: 14px 16px;
  background: ${({ theme }) => theme.colors.neutral100};
  border-radius: 10px;
`;
export const P_ProgressBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
  height: 150px;
  padding: 14px 24px;
  margin: 0 auto;
  border: 1px solid ${({ theme }) => theme.colors.neutral200};
  border-radius: 10px;
`;
export const P_ScaleBox = styled.div`
  width: 100%;
  height: 20%;
  display: flex;
  justify-content: space-between;
`;
