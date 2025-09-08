import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/useToast';
import { changePassword } from '@/apis/auth';
import { validatePassword, validatePasswordConfirm } from '@/utils/validation/profileValidation';
import { theme } from '@/styles/theme';
import { Icon } from '@/components/common';
import { Input } from '@/components/common/Input/Input';
import Header from '@/layout/Header';
import AlertToast from '@/components/common/AlertToast/AlertToast';
import * as S from '@/components/myPage/ChangePasswordPage.styles';
import type { ChangePasswordRequest } from '@/types/api';

interface FormData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface FormErrors {
  currentPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
}

interface FormSuccess {
  newPassword?: string;
  confirmPassword?: string;
}

export default function ChangePasswordPage() {
  const navigate = useNavigate();
  const { showError, toasts } = useToast();

  // 폼 상태
  const [formData, setFormData] = useState<FormData>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [formSuccess, setFormSuccess] = useState<FormSuccess>({});
  const [touchedFields, setTouchedFields] = useState<Record<string, boolean>>({});
  const [isLoading, setIsLoading] = useState(false);

  // 비밀번호 표시 상태
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // 뒤로가기
  const handleGoBack = () => {
    navigate('/mypage/profile');
  };

  // 입력값 변경
  const handleInputChange = (field: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFormData((prev) => ({ ...prev, [field]: value }));

    // 터치된 필드만 실시간 검사
    if (touchedFields[field]) {
      validateField(field, value);
    }
  };

  // 필드 포커스 해제 시
  const handleFieldBlur = (field: keyof FormData) => () => {
    setTouchedFields((prev) => ({ ...prev, [field]: true }));
    validateField(field, formData[field]);
  };

  // 필드별 유효성 검사
  const validateField = (field: keyof FormData, value: string) => {
    const newErrors = { ...formErrors };
    const newSuccess = { ...formSuccess };

    switch (field) {
      case 'currentPassword':
        if (!value) {
          newErrors.currentPassword = '현재 비밀번호를 입력해주세요.';
        } else {
          delete newErrors.currentPassword;
        }
        break;

      case 'newPassword': {
        const passwordResult = validatePassword(value);
        if (passwordResult.error) {
          newErrors.newPassword = passwordResult.error;
          delete newSuccess.newPassword;
        } else {
          delete newErrors.newPassword;
          newSuccess.newPassword = passwordResult.success;
        }

        // 새 비밀번호 확인도 재검사
        if (formData.confirmPassword && touchedFields.confirmPassword) {
          const confirmResult = validatePasswordConfirm(formData.confirmPassword, value);
          if (confirmResult.error) {
            newErrors.confirmPassword = confirmResult.error;
            delete newSuccess.confirmPassword;
          } else {
            delete newErrors.confirmPassword;
            newSuccess.confirmPassword = confirmResult.success;
          }
        }
        break;
      }

      case 'confirmPassword': {
        const confirmResult = validatePasswordConfirm(value, formData.newPassword);
        if (confirmResult.error) {
          newErrors.confirmPassword = confirmResult.error;
          delete newSuccess.confirmPassword;
        } else {
          delete newErrors.confirmPassword;
          newSuccess.confirmPassword = confirmResult.success;
        }
        break;
      }
    }

    setFormErrors(newErrors);
    setFormSuccess(newSuccess);
  };

  // 폼 유효성 검사
  const isFormValid = () => {
    return (
      formData.currentPassword &&
      formData.newPassword &&
      formData.confirmPassword &&
      !formErrors.currentPassword &&
      !formErrors.newPassword &&
      !formErrors.confirmPassword &&
      formData.newPassword === formData.confirmPassword
    );
  };

  // 비밀번호 변경 처리
  const handleSubmit = async () => {
    if (!isFormValid() || isLoading) return;

    try {
      setIsLoading(true);

      const requestData: ChangePasswordRequest = {
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
        confirmPassword: formData.confirmPassword,
      };

      await changePassword(requestData);

      navigate('/mypage/profile', {
        state: { successMessage: '비밀번호 수정이 완료되었습니다.' },
      });
    } catch (error: unknown) {
      console.error('비밀번호 변경 실패:', error);

      let errorMessage = '비밀번호 변경에 실패했습니다.';

      // 타입 안전한 방식으로 에러 메시지 추출
      if (error && typeof error === 'object' && 'response' in error) {
        const response = (error as Record<string, unknown>).response;

        if (response && typeof response === 'object' && 'data' in response) {
          const data = (response as Record<string, unknown>).data;

          if (data && typeof data === 'object' && 'message' in data) {
            const message = (data as Record<string, unknown>).message;

            if (typeof message === 'string' && message.length > 0) {
              errorMessage = message;
            }
          }
        }
      }

      showError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Header type="back" title="비밀번호 변경" onLeftClick={handleGoBack} />

      <S.Container>
        {/* 폼 */}
        <S.FormSection>
          {/* 현재 비밀번호 */}
          <S.FormGroup>
            <S.PasswordWrapper>
              <Input
                label="현재 비밀번호"
                type={showCurrentPassword ? 'text' : 'password'}
                placeholder="현재 비밀번호를 입력해주세요."
                value={formData.currentPassword}
                onChange={handleInputChange('currentPassword')}
                onBlur={handleFieldBlur('currentPassword')}
              />
              <S.PasswordToggleButton
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
              >
                <Icon
                  name={showCurrentPassword ? 'eyeOpen' : 'eyeClosed'}
                  size={20}
                  color={theme.colors.neutral500}
                />
              </S.PasswordToggleButton>
            </S.PasswordWrapper>
            {formErrors.currentPassword && (
              <S.ErrorMessage>{formErrors.currentPassword}</S.ErrorMessage>
            )}
          </S.FormGroup>

          {/* 새 비밀번호 */}
          <S.FormGroup>
            <S.PasswordWrapper>
              <Input
                label="새 비밀번호"
                type={showNewPassword ? 'text' : 'password'}
                placeholder="새 비밀번호를 입력해주세요."
                value={formData.newPassword}
                onChange={handleInputChange('newPassword')}
                onBlur={handleFieldBlur('newPassword')}
              />
              <S.PasswordToggleButton
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
              >
                <Icon
                  name={showNewPassword ? 'eyeOpen' : 'eyeClosed'}
                  size={20}
                  color={theme.colors.neutral500}
                />
              </S.PasswordToggleButton>
            </S.PasswordWrapper>
            {formSuccess.newPassword && (
              <S.SuccessMessage>{formSuccess.newPassword}</S.SuccessMessage>
            )}
            {formErrors.newPassword && <S.ErrorMessage>{formErrors.newPassword}</S.ErrorMessage>}
          </S.FormGroup>

          {/* 새 비밀번호 확인 */}
          <S.FormGroup>
            <S.PasswordWrapper>
              <Input
                label="새 비밀번호 확인"
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="새 비밀번호를 다시 입력해주세요."
                value={formData.confirmPassword}
                onChange={handleInputChange('confirmPassword')}
                onBlur={handleFieldBlur('confirmPassword')}
              />
              <S.PasswordToggleButton
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                <Icon
                  name={showConfirmPassword ? 'eyeOpen' : 'eyeClosed'}
                  size={20}
                  color={theme.colors.neutral500}
                />
              </S.PasswordToggleButton>
            </S.PasswordWrapper>
            {formSuccess.confirmPassword && (
              <S.SuccessMessage>{formSuccess.confirmPassword}</S.SuccessMessage>
            )}
            {formErrors.confirmPassword && (
              <S.ErrorMessage>{formErrors.confirmPassword}</S.ErrorMessage>
            )}
          </S.FormGroup>
        </S.FormSection>

        {/* 변경 버튼 */}
        <S.SubmitButton onClick={handleSubmit} disabled={!isFormValid() || isLoading}>
          {isLoading ? '변경 중...' : '변경'}
        </S.SubmitButton>
      </S.Container>

      {/* 토스트 알림 */}
      {toasts.map((toast) => (
        <AlertToast
          key={toast.id}
          type={toast.type}
          content={toast.content}
          title={toast.title}
          position={toast.position}
          duration={toast.duration}
        />
      ))}
    </>
  );
}
