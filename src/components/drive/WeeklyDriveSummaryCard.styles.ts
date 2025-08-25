import styled from '@emotion/styled';

export const SummaryWrapper = styled.div`
  background: ${({ theme }) => theme.colors.white};
  border: 1px solid ${({ theme }) => theme.colors.neutral300};
  padding: 24px 20px;
  margin: 18px;
  border-radius: 10px;
`;

export const Title = styled.p`
  font-weight: 600;
  font-size: ${({ theme }) => theme.fontSize[16]};
  color: ${({ theme }) => theme.colors.neutral600};
  margin-bottom: 18px;
`;

export const MetricsSection = styled.div`
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

export const MetricItem = styled.div`
  display: flex;
  align-items: center;
  color: ${({ theme }) => theme.colors.neutral600};
`;

export const Dot = styled.span<{ color: string }>`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: ${(props) => props.color};
  display: inline-block;
  margin-right: 6px;
`;

export const MetricLabel = styled.span`
  flex: 1;
  font-size: ${({ theme }) => theme.fontSize[14]};
`;

export const MetricValue = styled.span`
  font-size: ${({ theme }) => theme.fontSize[14]};
  margin-left: auto;
`;
