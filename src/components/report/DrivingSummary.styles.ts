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

export const SummaryBox = styled.div``;

export const SummaryTitle = styled.h3`
  font-size: ${({ theme }) => theme.fontSize[18]};
  font-weight: 700;
  color: ${({ theme }) => theme.colors.neutral600};
  margin-bottom: 10px;
  line-height: 1.4;

  & b {
    color: ${({ theme }) => theme.colors.primary600};
  }
`;

export const DateText = styled.p`
  font-size: ${({ theme }) => theme.fontSize[16]};
  color: ${({ theme }) => theme.colors.neutral500};
  margin-bottom: 20px;
`;

export const InfoList = styled.ul`
  padding: 20px;
  background-color: ${({ theme }) => theme.colors.neutral50};
  list-style: none;
  margin: 0;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  gap: 16px;

  li {
    font-size: ${({ theme }) => theme.fontSize[16]};
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }

  span:first-of-type {
    color: ${({ theme }) => theme.colors.neutral500};
  }

  span:last-of-type {
    font-weight: 500;
    color: ${({ theme }) => theme.colors.neutral600};
  }
`;
