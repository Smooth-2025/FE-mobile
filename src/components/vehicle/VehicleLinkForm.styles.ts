import styled from '@emotion/styled';

export const ButtonBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 0px;
`;

export const ErrorText = styled.div`
  color: ${({ theme }) => theme.colors.danger600};
  font-size: 12px;
  margin-bottom: 16px;
`;
