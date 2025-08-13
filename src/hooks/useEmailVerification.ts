import { useState } from 'react';
import { sendVerificationCode, verifyEmailCode } from '@apis/auth';
import { useToast } from '@hooks/useToast';
import type { AxiosError } from 'axios';

export const useEmailVerification = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [verificationSent, setVerificationSent] = useState(false);
  const [verifiedEmail, setVerifiedEmail] = useState<string | null>(null);
  const { showLoginError, showSuccess } = useToast();

  // 인증코드 발송
  const sendCode = async (email: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      const response = await sendVerificationCode({ email });
      
      setVerificationSent(true);
      console.warn('인증코드 만료시간:', response.expirationTime + '초');

      return true;
    } catch (error: unknown) {
      const axiosError = error as AxiosError<{ message?: string }>;
      const errorMessage = axiosError.response?.data?.message;
      
      // 이미 가입된 이메일인 경우
      if (axiosError.response?.status === 409) {
        showLoginError('이미 가입된 회원입니다.');
      } else {
        showLoginError(errorMessage || '인증코드 발송에 실패했습니다.');
      }
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // 인증코드 검증
  const verifyCode = async (email: string, code: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      const response = await verifyEmailCode({ email, code });
      
      if (response.verified) {
        setVerifiedEmail(email);
        return true;
      } else {
        showLoginError('인증번호를 확인해 주세요');
        return false;
      }
    } catch (error: unknown) {
      const axiosError = error as AxiosError<{ message?: string }>;
      const errorMessage = axiosError.response?.data?.message || '인증에 실패했습니다.';
      showLoginError(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // 재전송
  const resendCode = async (email: string): Promise<boolean> => {
    const success = await sendCode(email);
    if (success) {
      showSuccess('이메일 재전송 완료. 다시 확인해주세요');
    }
    return success;
  };

  return {
    isLoading,
    verificationSent,
    verifiedEmail,
    sendCode,
    verifyCode,
    resendCode,
  };
};