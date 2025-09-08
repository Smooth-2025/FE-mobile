import styled from '@emotion/styled';
import { horizontalPadding } from '@/styles/mixins';

export const Section = styled.section`
  ${horizontalPadding.layout_Base}
  background-color:${({ theme }) => theme.colors.white};
  padding-top: 24px;
  padding-bottom: 32px;
`;

export const SectionTitle = styled.h2`
  font-size: ${({ theme }) => theme.fontSize[12]};
  font-weight: 600;
  margin-bottom: 6px;
  color: ${({ theme }) => theme.colors.neutral500};
`;

export const DNATitle = styled.h3`
  font-size: ${({ theme }) => theme.fontSize[18]};
  font-weight: 700;
  color: ${({ theme }) => theme.colors.neutral600};
  line-height: 1.4;
  margin-bottom: 16px;

  & b {
    color: ${({ theme }) => theme.colors.primary600};
  }
`;

export const DNAListBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;
export const DNACard = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 12px 16px;
  border-radius: 10px;
  background-color: ${({ theme }) => theme.colors.primary100};
`;

export const Icon = styled.img`
  width: 40px;
  height: 40px;
  flex-shrink: 0;
`;

export const Content = styled.div`
  display: flex;
  flex-direction: column;
`;

export const Title = styled.div`
  font-weight: 600;
  color: ${({ theme }) => theme.colors.neutral600};
  font-size: ${({ theme }) => theme.fontSize[14]};
  margin-bottom: 4px;
`;

export const Description = styled.p`
  line-height: 1.4;
  color: ${({ theme }) => theme.colors.neutral600};
  font-size: ${({ theme }) => theme.fontSize[14]};
`;
