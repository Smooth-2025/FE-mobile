import styled from '@emotion/styled';
import { theme } from '@styles/theme';

export const Container = styled.div`
  padding: 20px;
  max-width: 400px;
  margin: 0 auto;
`;

export const Header = styled.div`
  margin-bottom: 32px;
`;

export const BackButton = styled.button`
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  padding: 8px;
  margin-bottom: 20px;
`;

export const ProgressBar = styled.div`
  width: 100%;
  height: 4px;
  background-color: #e5e7eb;
  border-radius: 2px;
  margin-bottom: 24px;
`;

export const ProgressFill = styled.div<{ progress: number }>`
  width: ${(props) => props.progress}%;
  height: 100%;
  background-color: ${theme.colors.primary500};
  border-radius: 2px;
  transition: width 0.3s ease;
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
  background-color: #ffffffff;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
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
  font-weight: ${(props) => (props.isAll ? '600' : '400')};
  color: ${theme.colors.neutral700};
  flex: 1;
  cursor: pointer;
`;

export const TermsContent = styled.div`
  margin-top: 16px;
  padding: 16px;
  background-color: #ffffff;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
  font-size: 12px;
  line-height: 1.5;
  color: ${theme.colors.neutral600};
  max-height: 120px;
  overflow-y: auto;
`;

export const TermsLink = styled.span`
  color: ${theme.colors.primary500};
  text-decoration: underline;
  cursor: pointer;

  &:hover {
    color: ${theme.colors.primary600};
  }
`;

export const ConfirmButton = styled.button<{ disabled: boolean }>`
  width: 100%;
  padding: 16px;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: ${(props) => (props.disabled ? 'not-allowed' : 'pointer')};
  transition: all 0.2s ease;
  margin-top: 32px;

  background-color: ${(props) => (props.disabled ? '#e5e7eb' : theme.colors.primary500)};
  color: ${(props) => (props.disabled ? '#9ca3af' : '#ffffff')};

  &:hover {
    background-color: ${(props) => (props.disabled ? '#e5e7eb' : theme.colors.primary600)};
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
  border: 2px solid ${(props) => (props.checked ? theme.colors.primary600 : '#d1d5db')};
  background-color: ${(props) => (props.checked ? theme.colors.primary600 : '#ffffff')};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  flex-shrink: 0;

  &:hover {
    border-color: ${theme.colors.primary600};
  }

  // 체크 표시
  &::after {
    content: '';
    width: 6px;
    height: 10px;
    border: solid #ffffff;
    border-width: 0 2px 2px 0;
    transform: rotate(45deg);
    opacity: ${(props) => (props.checked ? 1 : 0)};
    transition: opacity 0.2s ease;
  }
`;
