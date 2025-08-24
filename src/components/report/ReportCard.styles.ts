import styled from '@emotion/styled';

export const ReportCardContainer = styled.div<{ $status: string }>`
  position: relative;
  border-radius: 10px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 8px;
  cursor: pointer;
  background: ${({ $status, theme }) =>
    $status === 'processing' ? theme.colors.neutral200 : theme.colors.primary100};
  border: 1px solid
    ${({ $status, theme }) =>
      $status === 'processing' ? theme.colors.neutral200 : theme.colors.primary600};
`;

export const NotificationBadge = styled.div`
  position: absolute;
  top: 15px;
  right: 18px;
  width: 8px;
  height: 8px;
  background: ${({ theme }) => theme.colors.danger600};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1;
`;

export const ReportIcon = styled.img`
  width: 38px;
  height: 38px;
  border-radius: 8px;
  object-fit: cover;
  flex-shrink: 0;
`;

export const ReportTextBox = styled.div`
  flex: 1;
  min-width: 0;
`;

export const ReportTitle = styled.p`
  margin: 0;
  font-weight: 700;
  font-size: ${({ theme }) => theme.fontSize[14]};
  color: ${({ theme }) => theme.colors.neutral600};
`;

export const ReportSub = styled.p`
  margin: 4px 0 0;
  font-size: ${({ theme }) => theme.fontSize[14]};
  color: ${({ theme }) => theme.colors.neutral600};
`;
