import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styled from '@emotion/styled';
import { Input } from '@components/common';
import { useEmailVerification } from '@hooks/useEmailVerification';
import { useCountdown } from '@hooks/useCountdown';
import { useToast } from '@hooks/useToast';
import { theme } from '@styles/theme';

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

const EmailDisplay = styled.div`
  padding: 16px;
  background-color: #f9fafb;
  border-radius: 8px;
  margin-bottom: 24px;
  font-size: 16px;
  color: ${theme.colors.neutral700};
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

const TimerDisplay = styled.div`
  text-align: right;
  color: ${theme.colors.primary500};
  font-size: 14px;
  font-weight: 600;
  margin-top: 8px;
`;

const VerifyButton = styled.button<{ disabled: boolean }>`
  width: 100%;
  padding: 16px;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  transition: all 0.2s ease;
  margin-bottom: 16px;
  
  background-color: ${props => props.disabled ? '#e5e7eb' : theme.colors.primary500};
  color: ${props => props.disabled ? '#9ca3af' : '#ffffff'};
  
  &:hover {
    background-color: ${props => props.disabled ? '#e5e7eb' : theme.colors.primary600};
  }
  
  &:active {
    transform: ${props => props.disabled ? 'none' : 'translateY(1px)'};
  }
`;

const ResendText = styled.div`
  text-align: center;
  font-size: 14px;
  color: ${theme.colors.neutral600};
`;

const ResendLink = styled.button`
  background: none;
  border: none;
  color: ${theme.colors.primary500};
  text-decoration: underline;
  cursor: pointer;
  font-size: 14px;
  
  &:hover {
    color: ${theme.colors.primary600};
  }
`;

export function EmailVerificationPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { showToast } = useToast();
  
  const [verificationCode, setVerificationCode] = useState('');
  const [codeError, setCodeError] = useState('');
  const { verifyCode, resendCode, isLoading } = useEmailVerification();
  
  // 이메일 가져오기
  const email = location.state?.email;
  
  // 타이머 설정 (3분 = 180초)
  const { formattedTime, isExpired, startTimer, resetTimer } = useCountdown({
    initialSeconds: 180,
    onComplete: () => {
    showToast({ 
      type: 'error', 
      content: '인증 유효 시간이 지났습니다. 다시 요청해주세요.' 
    })}
  });

  useEffect(() => {
    if (!email) {
      navigate('/signup/email');
      return;
    }
    
    // 타이머 시작
    startTimer();
  }, [email, navigate, startTimer]);

  // 인증번호 유효성 검사
  const validateCode = (code: string): string => {
    if (!code) {
      return '인증번호를 입력해주세요.';
    }
    if (!/^\d{5}$/.test(code)) {
      return '인증번호는 5자리 숫자입니다.';
    }
    return '';
  };

  // 인증번호 입력 처리
  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 5); // 숫자만, 최대 5자리
    setVerificationCode(value);
    
    // 실시간 유효성 검사
    const error = validateCode(value);
    setCodeError(error);
  };

  // 인증 완료
  const handleVerify = async () => {
    if (isExpired) {
      showToast({
        type: 'error',
        content: '인증 시간이 만료되었습니다.'
      });
      return;
    }

    const error = validateCode(verificationCode);
    if (error) {
      setCodeError(error);
      return;
    }

    const success = await verifyCode(email, verificationCode);
    if (success) {
      // 다음 단계로 이동
      navigate('/signup/profile', { 
        state: { email, emailVerified: true } 
      });
    } else {
      setCodeError('인증번호를 확인해 주세요');
    }
  };

  // 재전송
  const handleResend = async () => {
    const success = await resendCode(email);
    if (success) {
      resetTimer();
      setVerificationCode('');
      setCodeError('');
    }
  };

  const isCodeValid = verificationCode.length === 5 && !codeError;

  return (
    <Container>
      <Header>
        <BackButton onClick={() => navigate(-1)}>
          ←
        </BackButton>
        
        <ProgressBar>
          <ProgressFill progress={25} />
        </ProgressBar>
        
        <Title>이메일 인증</Title>
        <Subtitle>
          {email}로 인증코드를 발송했습니다.<br />
          메일을 확인하고 인증코드 5자리를 입력해주세요.
        </Subtitle>
      </Header>

      <EmailDisplay>{email}</EmailDisplay>

      <FormGroup>
        <Label>인증코드</Label>
        <Input
          type="text"
          placeholder="인증코드 5자리"
          value={verificationCode}
          onChange={handleCodeChange}
          maxLength={5}

          style={{
            borderColor: codeError ? '#ef4444' : undefined,
             borderWidth: codeError ? '2px' : '1px'
          }}
        />
        {codeError && (
    <ErrorMessage>{codeError}</ErrorMessage>
    )}

        {!isExpired && !codeError &&(
          <TimerDisplay>{formattedTime}</TimerDisplay>
        )}

        {isExpired && (
    <ErrorMessage>인증 시간이 만료되었습니다.</ErrorMessage>
  )}
      </FormGroup>

      <VerifyButton
        disabled={!isCodeValid || isLoading || isExpired}
        onClick={handleVerify}
      >
        {isLoading ? '인증 중...' : '인증완료'}
      </VerifyButton>

      <ResendText>
        메일이 도착하지 않았나요?{' '}
        <ResendLink onClick={handleResend} disabled={isLoading}>
          재전송
        </ResendLink>
      </ResendText>
    </Container>
  );
}

export default EmailVerificationPage;