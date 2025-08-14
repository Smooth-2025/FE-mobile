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
  width: ${props => props.progress}%;
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

export const FormGroup = styled.div`
  margin-bottom: 24px;
`;

export const Label = styled.label`
  display: block;
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 8px;
  color: ${theme.colors.neutral700};
`;

export const BloodTypeGroup = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
  margin-top: 8px;
`;

export const BloodTypeButton = styled.button<{ selected: boolean }>`
  padding: 16px;
  border: 2px solid ${props => props.selected ? theme.colors.primary500 : '#e5e7eb'};
  border-radius: 8px;
  background: ${props => props.selected ? theme.colors.primary50 : '#ffffff'};
  color: ${props => props.selected ? theme.colors.primary500 : theme.colors.neutral700};
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    border-color: ${theme.colors.primary500};
    background-color: ${theme.colors.primary50};
  }
`;

export const ErrorMessage = styled.p`
  color: #ef4444;
  font-size: 12px;
  margin: 4px 0 0 0;
  line-height: 1.4;
`;

export const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 32px;
`;

export const RegisterButton = styled.button`
  flex: 1;
  padding: 16px;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  
  background-color: ${theme.colors.primary500};
  color: #ffffff;
  
  &:hover {
    background-color: ${theme.colors.primary600};
  }
  
  &:active {
    transform: translateY(1px);
  }
`;

export const SkipButton = styled.button`
  background: none;
  border: none;
  color: ${theme.colors.neutral600};
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  padding: 16px 0;
  text-decoration: underline;
  transition: all 0.2s ease;
  margin-top: 16px;
  width: 100%;
  
  &:hover {
    color: ${theme.colors.neutral700};
  }
`;