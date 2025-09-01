import styled from '@emotion/styled';

export const SheetTitle = styled.h3`
  font-size: ${({ theme }) => theme.fontSize[22]};
  font-weight: bold;
`;
export const SheetSubTitle = styled.p`
  color: ${({ theme }) => theme.colors.neutral500};
  font-size: ${({ theme }) => theme.fontSize[16]};
  margin: 12px 0 20px;
  line-height: 22px;
`;
