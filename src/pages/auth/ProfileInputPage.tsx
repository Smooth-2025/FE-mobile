import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Input } from '@components/common';
import { Icon } from '@components/common/Icons';
import { theme } from '@styles/theme';
import Header from '@layout/Header';
import { useProfileForm } from '@hooks/useProfileForm';
import { useAppDispatch, useAppSelector } from '@hooks/useAppRedux';
import { 
  setSignupStep, 
  nextSignupStep,
  selectSignupCurrentStep 
} from '@store/slices/authSlice';
import { StepProgressBar } from '@components/auth/StepProgressBar';
import {
  Container,
  Content,
  Title,
  FormGroup,
  Label,
  PasswordWrapper,
  PasswordToggleButton,
  SuccessMessage,
  ErrorMessage,
  GenderGroup,
  GenderButton,
  NextButton,
} from '@components/auth/ProfileInputStyles';

export function ProfileInputPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const currentStep = useAppSelector(selectSignupCurrentStep);

  // 이메일 정보 가져오기
  const email = location.state?.email;
  const emailVerified = location.state?.emailVerified;

  // 커스텀 훅 사용
  const {
    formData,
    formErrors,
    formSuccess,
    handleInputChange,
    handleFieldBlur,
    handleGenderSelect,
    isFormValid,
  } = useProfileForm();

  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);

  // 이메일 인증 확인 및 스텝 설정
  useEffect(() => {
    if (!email || !emailVerified) {
      navigate('/signup/email');
      return;
    }
    
    // 현재 스텝 설정 (프로필 입력은 2단계)
    dispatch(setSignupStep(2));
  }, [email, emailVerified, navigate, dispatch]);

  // 다음 단계로
  const handleNext = () => {
    if (isFormValid()) {
      dispatch(nextSignupStep()); // 3단계로 변경
      navigate('/signup/terms', {
        state: {
          email,
          emailVerified,
          profileData: formData,
        },
      });
    }
  };

  return (
    <>
      <Header 
        type="back" 
        onLeftClick={() => navigate(-1)} 
      />
      
      <Container>
        <Content>
          <StepProgressBar currentStep={currentStep} />

          <Title>필수 정보를 입력해주세요</Title>

      {/* 비밀번호 */}
      <FormGroup>
        <Label>비밀번호</Label>
        <PasswordWrapper>
          <Input
            type={showPassword ? 'text' : 'password'}
            placeholder="비밀번호를 입력해주세요."
            value={formData.password}
            onChange={handleInputChange('password')}
            onBlur={handleFieldBlur('password')}
            style={{
              borderColor: formErrors.password
                ? '#ef4444'
                : formSuccess.password
                  ? '#22c55e'
                  : undefined,
              borderWidth: formErrors.password || formSuccess.password ? '2px' : '1px',
              paddingRight: '60px',
            }}
          />
          <PasswordToggleButton type="button" onClick={() => setShowPassword(!showPassword)}>
            <Icon
              name={showPassword ? 'eyeOpen' : 'eyeClosed'}
              size={20}
              color={theme.colors.neutral500}
            />
          </PasswordToggleButton>
        </PasswordWrapper>
        {formSuccess.password && <SuccessMessage>{formSuccess.password}</SuccessMessage>}
        {formErrors.password && <ErrorMessage>{formErrors.password}</ErrorMessage>}
      </FormGroup>

      {/* 비밀번호 확인 */}
      <FormGroup>
        <Label>비밀번호 확인</Label>
        <PasswordWrapper>
          <Input
            type={showPasswordConfirm ? 'text' : 'password'}
            placeholder="비밀번호 확인"
            value={formData.passwordConfirm}
            onChange={handleInputChange('passwordConfirm')}
            onBlur={handleFieldBlur('passwordConfirm')}
            style={{
              borderColor: formErrors.passwordConfirm
                ? '#ef4444'
                : formSuccess.passwordConfirm
                  ? '#22c55e'
                  : undefined,
              borderWidth:
                formErrors.passwordConfirm || formSuccess.passwordConfirm ? '2px' : '1px',
              paddingRight: '60px',
            }}
          />
          <PasswordToggleButton
            type="button"
            onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
          >
            <Icon
              name={showPasswordConfirm ? 'eyeOpen' : 'eyeClosed'}
              size={20}
              color={theme.colors.neutral500}
            />
          </PasswordToggleButton>
        </PasswordWrapper>
        {formSuccess.passwordConfirm && (
          <SuccessMessage>{formSuccess.passwordConfirm}</SuccessMessage>
        )}
        {formErrors.passwordConfirm && <ErrorMessage>{formErrors.passwordConfirm}</ErrorMessage>}
      </FormGroup>

      {/* 이름 */}
      <FormGroup>
        <Label>이름</Label>
        <Input
          type="text"
          placeholder="이름을 입력해주세요."
          value={formData.name}
          onChange={handleInputChange('name')}
          onBlur={handleFieldBlur('name')}
          style={{
            borderColor: formErrors.name ? '#ef4444' : undefined,
            borderWidth: formErrors.name ? '2px' : '1px',
          }}
        />
        {formErrors.name && <ErrorMessage>{formErrors.name}</ErrorMessage>}
      </FormGroup>

      {/* 휴대폰 번호 */}
      <FormGroup>
        <Label>휴대폰 번호</Label>
        <Input
          type="text"
          placeholder="휴대폰 번호를 입력해주세요."
          value={formData.phone}
          onChange={handleInputChange('phone')}
          onBlur={handleFieldBlur('phone')}
          maxLength={13}
          style={{
            borderColor: formErrors.phone ? '#ef4444' : undefined,
            borderWidth: formErrors.phone ? '2px' : '1px',
          }}
        />
        {formErrors.phone && <ErrorMessage>{formErrors.phone}</ErrorMessage>}
      </FormGroup>

      {/* 성별 */}
      <FormGroup>
        <Label>성별</Label>
        <GenderGroup>
          <GenderButton
            type="button"
            selected={formData.gender === 'MALE'}
            onClick={() => handleGenderSelect('MALE')}
          >
            남성
          </GenderButton>
          <GenderButton
            type="button"
            selected={formData.gender === 'FEMALE'}
            onClick={() => handleGenderSelect('FEMALE')}
          >
            여성
          </GenderButton>
        </GenderGroup>
        {formErrors.gender && <ErrorMessage>{formErrors.gender}</ErrorMessage>}
      </FormGroup>

      <NextButton disabled={!isFormValid()} onClick={handleNext}>
        다음
      </NextButton>
        </Content>
      </Container>
    </>
  );
}

export default ProfileInputPage;
