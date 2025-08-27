import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '@components/common';
import { useEmailVerification } from '@hooks/useEmailVerification';
import { validateEmail } from '@/utils/validation/authValidation';
import AlertToast from '@components/common/AlertToast/AlertToast';
import {
  ErrorMessage,
  Container,
  Header,
  BackButton,
  ProgressBar,
  ProgressFill,
  Title,
  Subtitle,
  FormGroup,
  Label,
  SendButton,
} from '@/components/auth/EmailInputPage.styles';


export function EmailInputPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const { sendCode, isLoading, toasts } = useEmailVerification();


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
        state: { email },
      });
    }
  };

  const isEmailValid = email && !emailError;

  return (
    <>
      <Container>
        <Header>
          <BackButton onClick={() => navigate(-1)}>←</BackButton>

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
              borderColor: emailError ? '#ef4444' : email && !emailError ? '#22c55e' : undefined,
              borderWidth: emailError ? '2px' : '1px',
            }}
          />
          {emailError && <ErrorMessage>{emailError}</ErrorMessage>}
        </FormGroup>

        <SendButton disabled={!isEmailValid || isLoading} onClick={handleSendCode}>
          {isLoading ? '발송 중...' : '인증코드 전송'}
        </SendButton>
      </Container>
      {toasts &&
        toasts.map((toast) => (
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
