import styled from '@emotion/styled';
import { theme } from '@styles/theme';

export const Container = styled.div`
  padding: 20px;
  max-width: 400px;
  margin: 0 auto;
  height: 100%;
  background-color: ${theme.colors.white};
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
  background-color: ${theme.colors.neutral300};
  border-radius: 2px;
  margin-bottom: 24px;
`;

export const ProgressFill = styled.div<{ progress: number }>`
  width: ${(props) => props.progress}%;
  height: 100%;
  background-color: ${theme.colors.primary600};
  border-radius: 2px;
  transition: width 0.3s ease;
`;

export const Title = styled.h1`
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 8px;
  color: ${theme.colors.neutral700};
`;

export const FormGroup = styled.div`
  margin-bottom: 24px;
`;

export const Label = styled.label`
  display: block;
  font-size: 16px;
  margin-bottom: 8px;
  color: ${theme.colors.neutral600};
`;

export const PasswordWrapper = styled.div`
  position: relative;
`;

export const PasswordToggleButton = styled.button`
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background-color: ${theme.colors.neutral100};
  }
`;

export const SuccessMessage = styled.p`
  color: ${theme.colors.success600};
  font-size: 12px;
  margin: 4px 0 0 0;
  line-height: 1.4;
`;

export const ErrorMessage = styled.p`
  color: ${theme.colors.danger700};
  font-size: 12px;
  margin: 4px 0 0 0;
  line-height: 1.4;
`;

export const GenderGroup = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 8px;
`;

export const GenderButton = styled.button<{ selected: boolean }>`
  flex: 1;
  padding: 16px;
  border: 2px solid ${(props) => (props.selected ? theme.colors.primary600 : 0)};
  border-radius: 8px;
  background: ${(props) => (props.selected ? theme.colors.white : theme.colors.neutral50)};
  color: ${(props) => (props.selected ? theme.colors.neutral600 : theme.colors.neutral600)};
  font-size: 16px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: ${theme.colors.primary500};
    background-color: ${theme.colors.primary50};
  }
`;

export const NextButton = styled.button<{ disabled: boolean }>`
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
    background-color: ${(props) => (props.disabled ? theme.colors.neutral200 : theme.colors.primary600)};
  }

  &:active {
    transform: ${(props) => (props.disabled ? 'none' : 'translateY(1px)')};
  }
`;
