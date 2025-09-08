import styled from '@emotion/styled';
import { theme } from '@styles/theme';

export const Container = styled.div`
  max-width: 100%;
  margin: 0 auto;
  height: 100%;
  background-color: ${theme.colors.white};
`;

export const Content = styled.div`
  padding: 20px;
`;


export const Title = styled.h1`
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 8px;
  color: ${theme.colors.neutral700};
`;

export const Subtitle = styled.p`
  font-size: 16px;
  color: ${theme.colors.neutral700};
  margin-bottom: 32px;
`;

export const AgreementSection = styled.div`
  margin-bottom: 32px;
`;

export const AgreementItem = styled.div`
  margin-bottom: 24px;
`;

export const AllAgreementItem = styled(AgreementItem)`
  padding: 20px;
  background-color: ${theme.colors.neutral50};
  border-radius: 12px;
`;

export const CheckboxWrapper = styled.label`
  display: flex;
  align-items: center;
  cursor: pointer;
  gap: 12px;
`;

export const Checkbox = styled.input`
  width: 20px;
  height: 20px;
  accent-color: ${theme.colors.primary500};
  cursor: pointer;
`;

export const HiddenCheckbox = styled.input`
  position: absolute;
  opacity: 0;
  cursor: pointer;
  height: 0;
  width: 0;
`;

export const CheckboxLabel = styled.span<{ isAll?: boolean }>`
  font-size: ${(props) => (props.isAll ? '16px' : '14px')};
  color: ${theme.colors.neutral700};
  flex: 1;
  cursor: pointer;
`;

export const TermsContent = styled.div`
  margin-top: 16px;
  padding: 16px;
  background-color: ${theme.colors.white};
  border-radius: 8px;
  border: 1px solid ${theme.colors.neutral100};
  font-size: 12px;
  line-height: 1.5;
  color: ${theme.colors.neutral600};
  max-height: 120px;
  overflow-y: auto;
`;

export const TermsLink = styled.span`
  color: ${theme.colors.primary700};
  text-decoration: underline;
  cursor: pointer;

  &:hover {
    color: ${theme.colors.primary700};
  }
`;

export const ConfirmButton = styled.button<{ disabled: boolean }>`
  width: 100%;
  padding: 16px;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  cursor: ${(props) => (props.disabled ? 'not-allowed' : 'pointer')};
  transition: all 0.2s ease;
  margin-top: 32px;

  background-color: ${(props) => (props.disabled ? theme.colors.neutral200 : theme.colors.primary600)};
  color: ${(props) => (props.disabled ? theme.colors.neutral500 : theme.colors.white)};

  &:hover {
    background-color: ${(props) => (props.disabled ? theme.colors.neutral300 : theme.colors.primary600)};
  }

  &:active {
    transform: ${(props) => (props.disabled ? 'none' : 'translateY(1px)')};
  }
`;

// 커스텀 체크박스
export const CustomCheckbox = styled.div<{ checked: boolean }>`
  width: 20px;
  height: 20px;
  border-radius: 4px;
  border: 2px solid ${(props) => (props.checked ? theme.colors.primary600 : theme.colors.neutral400)};
  background-color: ${(props) => (props.checked ? theme.colors.primary600 : theme.colors.white)};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  flex-shrink: 0;

  &:hover {
    border-color: ${theme.colors.primary700};
  }

  // 체크 표시
  &::after {
    content: '';
    width: 6px;
    height: 10px;
    border: solid ${theme.colors.white};
    border-width: 0 2px 2px 0;
    transform: rotate(45deg);
    opacity: ${(props) => (props.checked ? 1 : 0)};
    transition: opacity 0.2s ease;
  }
`;
