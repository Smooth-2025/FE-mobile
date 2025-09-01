import styled from '@emotion/styled';
import { theme } from '@styles/theme';

export const Wrapper = styled.div`
  margin-bottom: 16px;
`;

export const StyledLabel = styled.label`
  display: inline-block;
  margin-bottom: 8px;
  font-size: 14px;
  color: ${theme.colors.neutral600};
`;

export const StyledInput = styled.input`
  width: 100%;
  box-sizing: border-box;
  background-color: ${theme.colors.neutral100};
  color: ${theme.colors.neutral600};
  font-size: 16px;
  border-radius: ${theme.borderRadius.md}px;
  padding: 12px 16px;
  outline: none;

  &::placeholder {
    color: ${theme.colors.neutral400}; /* RN의 placeholderTextColor 대체 */
  }

  &:focus {
    border-color: ${({ theme }) => theme.colors.primary700};
    background-color: ${({ theme }) => theme.colors.white};
    box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.primary600};
    outline: none;
  }

  /* 텍스트 데코/폰트 패딩은 웹 기본값이 적절하므로 제거 */
`;