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
  background-color: ${theme.colors.neutral50};
  color: ${theme.colors.neutral600};
  font-size: 16px;
  border: 1px solid ${theme.colors.neutral200};
  border-radius: ${theme.borderRadius.md}px;
  padding: 12px 16px;
  outline: none;

  &::placeholder {
    color: ${theme.colors.neutral400}; /* RN의 placeholderTextColor 대체 */
  }

  &:focus {
    border-color: ${theme.colors.primary500};
    box-shadow: 0 0 0 3px ${theme.colors.primary50};
  }

  /* 텍스트 데코/폰트 패딩은 웹 기본값이 적절하므로 제거 */
`;
