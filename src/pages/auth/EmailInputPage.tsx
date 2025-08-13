import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from '@emotion/styled';
import { Input } from '@components/common';
import { useEmailVerification } from '@hooks/useEmailVerification';
import { theme } from '@styles/theme';
import AlertToast from '@components/common/AlertToast/AlertToast';

const ErrorMessage = styled.p`
  color: #ef4444;
  font-size: 12px;
  margin: 4px 0 0 0;
  line-height: 1.4;
`;

const Container = styled.div`
  padding: 20px;
  max-width: 400px;
  margin: 0 auto;
`;

const Header = styled.div`
  margin-bottom: 32px;
`;

const BackButton = styled.button`
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  padding: 8px;
  margin-bottom: 20px;
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 4px;
  background-color: #e5e7eb;
  border-radius: 2px;
  margin-bottom: 24px;
`;

const ProgressFill = styled.div<{ progress: number }>`
  width: ${props => props.progress}%;
  height: 100%;
  background-color: ${theme.colors.primary500};
  border-radius: 2px;
  transition: width 0.3s ease;
`;

const Title = styled.h1`
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 8px;
  color: ${theme.colors.neutral700};
`;

const Subtitle = styled.p`
  font-size: 14px;
  color: ${theme.colors.neutral600};
  margin-bottom: 32px;
`;

const FormGroup = styled.div`
  margin-bottom: 24px;
`;

const Label = styled.label`
  display: block;
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 8px;
  color: ${theme.colors.neutral700};
`;

const SendButton = styled.button<{ disabled: boolean }>`
  width: 100%;
  padding: 16px;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  transition: all 0.2s ease;
  
  background-color: ${props => props.disabled ? '#e5e7eb' : theme.colors.primary500};
  color: ${props => props.disabled ? '#9ca3af' : '#ffffff'};
  
  &:hover {
    background-color: ${props => props.disabled ? '#e5e7eb' : theme.colors.primary600};
  }
  
  &:active {
    transform: ${props => props.disabled ? 'none' : 'translateY(1px)'};
  }
`;

export function EmailInputPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const { sendCode, isLoading, toasts } = useEmailVerification();

  // 이메일 유효성 검사
  const validateEmail = (email: string): string => {
    if (!email) {
      return '이메일을 입력해주세요.';
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return '이메일을 다시 확인해주세요';
    }
    return '';
  };

  // 이메일 입력 처리
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    
    // 실시간 유효성 검사
    const error = validateEmail(value);
    setEmailError(error);
  };

  // 인증코드 발송
  const handleSendCode = async () => {
    const error = validateEmail(email);
    if (error) {
      setEmailError(error);
      return;
    }

    const success = await sendCode(email);
    if (success) {
      // 인증 페이지로 이동
      navigate('/signup/verification', { 
        state: { email } 
      });
    }
  };

  const isEmailValid = email && !emailError;

  return (
    <>
    <Container>
      <Header>
        <BackButton onClick={() => navigate(-1)}>
          ←
        </BackButton>
        
        <ProgressBar>
          <ProgressFill progress={25} />
        </ProgressBar>
        
        <Title>이메일을 입력해주세요</Title>
        <Subtitle>로그인에 사용될 이메일입니다</Subtitle>
      </Header>

      <FormGroup>
        <Label>이메일</Label>
        <Input
          type="email"
          placeholder="이메일을 입력해주세요"
          value={email}
          onChange={handleEmailChange}
          style={{
      borderColor: emailError ? '#ef4444' : 
                   email && !emailError ? '#22c55e' : 
                   undefined,
      borderWidth: emailError ? '2px' : '1px'
    }}
        />
        {emailError && (
    <ErrorMessage>{emailError}</ErrorMessage>
  )}
      </FormGroup>

      <SendButton
        disabled={!isEmailValid || isLoading}
        onClick={handleSendCode}
      >
        {isLoading ? '발송 중...' : '인증코드 전송'}
      </SendButton>
    </Container>
    {toasts && toasts.map(toast => (
        <AlertToast
          key={toast.id}
          type={toast.type}
          title={toast.title}
          content={toast.content}
          position={toast.position}
          duration={toast.duration}
        />
      ))}
    </>
    
  );
}

export default EmailInputPage;