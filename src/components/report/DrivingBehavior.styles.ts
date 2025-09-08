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
export const BehaviorWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 35px;
`;

export const BehaviorTitle = styled.h3`
  font-size: ${({ theme }) => theme.fontSize[18]};
  font-weight: 700;
  color: ${({ theme }) => theme.colors.neutral600};
  line-height: 1.4;
  margin-bottom: 16px;

  & b {
    color: ${({ theme }) => theme.colors.primary600};
  }
`;

// 운전 행동 요약
export const BehaviorList = styled.ul`
  display: flex;
  gap: 8px;
`;

export const BehaviorItem = styled.li`
  flex: 1;
  text-align: left;
  background: ${({ theme }) => theme.colors.neutral50};
  border-radius: 10px;
  padding: 14px;

  h4 {
    font-size: ${({ theme }) => theme.fontSize[12]};
    font-weight: 400;
    margin-bottom: 12px;
    color: ${({ theme }) => theme.colors.neutral600};
  }

  p {
    font-size: ${({ theme }) => theme.fontSize[16]};
    color: ${({ theme }) => theme.colors.neutral500};

    span {
      font-size: ${({ theme }) => theme.fontSize[24]};
      font-weight: 600;
      color: ${({ theme }) => theme.colors.neutral600};
      margin-right: 0.25rem;
    }
  }
`;

export const InsightText = styled.p`
  width: 100%;
  padding: 14px 20px;
  color: ${({ theme }) => theme.colors.neutral600};
  background-color: #edf8f8;
  border-radius: 10px;
  font-size: ${({ theme }) => theme.fontSize[14]};
  line-height: 1.3;
`;
