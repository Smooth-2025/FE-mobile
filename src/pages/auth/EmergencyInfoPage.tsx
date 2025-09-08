import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Input } from '@components/common';
import { useEmergencyForm } from '@hooks/useEmergencyForm';
import Header from '@layout/Header';
import { useAppDispatch, useAppSelector } from '@hooks/useAppRedux';
import { setSignupStep, resetSignupStep, selectSignupCurrentStep } from '@store/slices/authSlice';
import { StepProgressBar } from '@components/auth/StepProgressBar';
import { registerUser } from '@apis/auth';
import {
  Container,
  Content,
  Title,
  Subtitle,
  FormGroup,
  Label,
  BloodTypeGroup,
  BloodTypeButton,
  ErrorMessage,
  ButtonGroup,
  RegisterButton,
  SkipButton,
} from '@components/auth/EmergencyInfoStyles';
import type { RegisterRequest } from '@/types/api';

export function EmergencyInfoPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const currentStep = useAppSelector(selectSignupCurrentStep);

  // 이전 단계 데이터 가져오기
  const email = location.state?.email;
  const emailVerified = location.state?.emailVerified;
  const profileData = location.state?.profileData;
  const termsData = location.state?.termsData;

  // 로딩 상태 추가
  const [isLoading, setIsLoading] = useState(false);

  // 커스텀 훅 사용
  const { formData, formErrors, handleInputChange, handleBloodTypeSelect, handleFieldBlur } =
    useEmergencyForm();

  // 이전 단계 데이터 확인 및 스텝 설정
  useEffect(() => {
    if (!email || !emailVerified || !profileData || !termsData) {
      navigate('/signup/email');
      return;
    }

    // 현재 스텝 설정 (응급정보는 4단계 - 마지막)
    dispatch(setSignupStep(4));
  }, [email, emailVerified, profileData, termsData, navigate, dispatch]);

  // 회원가입 데이터 생성 함수
  const createSignupData = (includeEmergencyData: boolean = true): RegisterRequest => {
    const baseData: RegisterRequest = {
      email,
      password: profileData.password,
      name: profileData.name,
      phone: profileData.phone.replace(/-/g, ''),
      gender: profileData.gender as 'MALE' | 'FEMALE',
      termsOfServiceAgreed: termsData.termsOfServiceAgreed,
      privacyPolicyAgreed: termsData.privacyPolicyAgreed,
    };

    // 응급정보가 포함된 경우에만 추가
    if (includeEmergencyData) {
      if (formData.bloodType) {
        baseData.bloodType = formData.bloodType as 'A' | 'B' | 'AB' | 'O';
      }
      if (formData.emergencyContact1) {
        baseData.emergencyContact1 = formData.emergencyContact1.replace(/-/g, '');
      }
      if (formData.emergencyContact2) {
        baseData.emergencyContact2 = formData.emergencyContact2.replace(/-/g, '');
      }
      if (formData.emergencyContact3) {
        baseData.emergencyContact3 = formData.emergencyContact3.replace(/-/g, '');
      }
    }

    return baseData;
  };

  // 회원가입 완료 (등록)
  const handleRegister = async () => {
    try {
      setIsLoading(true);

      // 유효성 검사 (긴급연락처가 입력된 경우에만)
      const hasErrors = Object.keys(formErrors).length > 0;
      if (hasErrors) {
        return;
      }

      const signupData = createSignupData(true);

      // 실제 API 호출
      await registerUser(signupData);

      // 회원가입 완료 후 스텝 초기화
      dispatch(resetSignupStep());

      // 회원가입 완료 페이지로 이동
      navigate('/signup/complete', {
        state: {
          email,
          name: profileData.name,
        },
      });
    } catch (error) {
      console.error('회원가입 실패:', error);
      alert('회원가입에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  // 건너뛰기
  const handleSkip = async () => {
    try {
      setIsLoading(true);

      const signupData = createSignupData(false);

      // 실제 API 호출
      await registerUser(signupData);

      // 회원가입 완료 후 스텝 초기화
      dispatch(resetSignupStep());

      // 회원가입 완료 페이지로 이동
      navigate('/signup/complete', {
        state: {
          email,
          name: profileData.name,
        },
      });
    } catch (error) {
      console.error('회원가입 실패:', error);
      alert('회원가입에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Header type="back" onLeftClick={() => navigate(-1)} />

      <Container>
        <Content>
          <StepProgressBar currentStep={currentStep} />

          <Title>응급 정보를 등록해주세요 (선택)</Title>
          <Subtitle>등록된 연락처로 사고 발생 알림 문자가 전송됩니다.</Subtitle>

          {/* 혈액형 */}
          <FormGroup>
            <Label>혈액형</Label>
            <BloodTypeGroup>
              {(['A', 'B', 'O', 'AB'] as const).map((type) => (
                <BloodTypeButton
                  key={type}
                  type="button"
                  selected={formData.bloodType === type}
                  onClick={() => handleBloodTypeSelect(type)}
                  disabled={isLoading}
                >
                  {type}
                </BloodTypeButton>
              ))}
            </BloodTypeGroup>
          </FormGroup>

          {/* 긴급연락처 1 */}
          <FormGroup>
            <Label>긴급연락처 1</Label>
            <Input
              type="text"
              placeholder="연락처를 입력해주세요."
              value={formData.emergencyContact1}
              onChange={handleInputChange('emergencyContact1')}
              onBlur={handleFieldBlur('emergencyContact1')}
              maxLength={13}
              disabled={isLoading}
              style={{
                borderColor: formErrors.emergencyContact1 ? '#ef4444' : undefined,
                borderWidth: formErrors.emergencyContact1 ? '2px' : '1px',
              }}
            />
            {formErrors.emergencyContact1 && (
              <ErrorMessage>{formErrors.emergencyContact1}</ErrorMessage>
            )}
          </FormGroup>

          {/* 긴급연락처 2 */}
          <FormGroup>
            <Label>긴급연락처 2</Label>
            <Input
              type="text"
              placeholder="연락처를 입력해주세요."
              value={formData.emergencyContact2}
              onChange={handleInputChange('emergencyContact2')}
              onBlur={handleFieldBlur('emergencyContact2')}
              maxLength={13}
              disabled={isLoading}
              style={{
                borderColor: formErrors.emergencyContact2 ? '#ef4444' : undefined,
                borderWidth: formErrors.emergencyContact2 ? '2px' : '1px',
              }}
            />
            {formErrors.emergencyContact2 && (
              <ErrorMessage>{formErrors.emergencyContact2}</ErrorMessage>
            )}
          </FormGroup>

          {/* 긴급연락처 3 */}
          <FormGroup>
            <Label>긴급연락처 3</Label>
            <Input
              type="text"
              placeholder="연락처를 입력해주세요."
              value={formData.emergencyContact3}
              onChange={handleInputChange('emergencyContact3')}
              onBlur={handleFieldBlur('emergencyContact3')}
              maxLength={13}
              disabled={isLoading}
              style={{
                borderColor: formErrors.emergencyContact3 ? '#ef4444' : undefined,
                borderWidth: formErrors.emergencyContact3 ? '2px' : '1px',
              }}
            />
            {formErrors.emergencyContact3 && (
              <ErrorMessage>{formErrors.emergencyContact3}</ErrorMessage>
            )}
          </FormGroup>

          <ButtonGroup>
            <RegisterButton onClick={handleRegister} disabled={isLoading}>
              {isLoading ? '등록 중...' : '등록'}
            </RegisterButton>
          </ButtonGroup>

          <SkipButton onClick={handleSkip} disabled={isLoading}>
            건너뛰기
          </SkipButton>
        </Content>
      </Container>
    </>
  );
}

export default EmergencyInfoPage;
