import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Input } from '@components/common';
import { useEmailVerification } from '@hooks/useEmailVerification';
import { useCountdown } from '@hooks/useCountdown';
import { useToast } from '@hooks/useToast';
import {
  validateVerificationCode,
  formatVerificationCode,
} from '@/utils/validation/authValidation';
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
  VerifyButton,
  ResendText,
  ResendLink,
  CodeInputWrapper,
  CodeTimerDisplay,
} from '@/components/auth/EmailVerificationPage.styles';

export function EmailVerificationPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { showToast, toasts } = useToast();

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
        content: '인증 유효 시간이 지났습니다. 다시 요청해주세요.',
      });
    },
  });

  useEffect(() => {
    if (!email) {
      navigate('/signup/email');
      return;
    }

    // 타이머 시작
    startTimer();
  }, [email, navigate, startTimer]);

  // 인증번호 입력 처리
  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = formatVerificationCode(e.target.value);
    setVerificationCode(value);

    // 실시간 유효성 검사
    const error = validateVerificationCode(value);
    setCodeError(error);
  };

  // 인증 완료
  const handleVerify = async () => {
    if (isExpired) {
      showToast({
        type: 'error',
        content: '인증 시간이 만료되었습니다.',
      });
      return;
    }

    const error = validateVerificationCode(verificationCode);
    if (error) {
      setCodeError(error);
      return;
    }

    const success = await verifyCode(email, verificationCode);
    if (success) {
      // 다음 단계로 이동
      navigate('/signup/profile', {
        state: { email, emailVerified: true },
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
    <>
      <Container>
        <Header>
          <BackButton onClick={() => navigate(-1)}>←</BackButton>
          <ProgressBar>
            <ProgressFill progress={25} />
          </ProgressBar>

          <Title>이메일 인증</Title>
          <Subtitle>
            {email}로 인증코드를 발송했습니다.
            <br />
            메일을 확인하고 인증코드 5자리를 입력해주세요.
          </Subtitle>
        </Header>

        {/* 이메일을 disabled Input으로 변경 */}
        <FormGroup>
          <Label>이메일</Label>
          <Input
            type="email"
            value={email}
            disabled
          />
        </FormGroup>

        {/* 인증코드 입력 - 타이머를 input 안에 표시 */}
        <FormGroup>
          <Label>인증코드</Label>
          <CodeInputWrapper>
            <Input
              type="text"
              placeholder="인증코드 5자리"
              value={verificationCode}
              onChange={handleCodeChange}
              maxLength={5}
            />
            {!isExpired && (
              <CodeTimerDisplay>{formattedTime}</CodeTimerDisplay>
            )}
          </CodeInputWrapper>
          
          {codeError && <ErrorMessage>{codeError}</ErrorMessage>}
          {isExpired && <ErrorMessage>인증 시간이 만료되었습니다.</ErrorMessage>}
        </FormGroup>

        <VerifyButton disabled={!isCodeValid || isLoading || isExpired} onClick={handleVerify}>
          {isLoading ? '인증 중...' : '인증완료'}
        </VerifyButton>

        <ResendText>
          메일이 도착하지 않았나요?{' '}
          <ResendLink onClick={handleResend} disabled={isLoading}>
            재전송
          </ResendLink>
        </ResendText>
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

export default EmailVerificationPage;