import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Input } from '@components/common';
import { useEmergencyForm } from '@hooks/useEmergencyForm';
import {
  Container,
  Header,
  BackButton,
  ProgressBar,
  ProgressFill,
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

export function EmergencyInfoPage() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // 이전 단계 데이터 가져오기
  const email = location.state?.email;
  const emailVerified = location.state?.emailVerified;
  const profileData = location.state?.profileData;
  const termsData = location.state?.termsData;
  
  // 커스텀 훅 사용
  const {
    formData,
    formErrors,
    handleInputChange,
    handleBloodTypeSelect,
    handleFieldBlur,
  } = useEmergencyForm();

  // 이전 단계 데이터 확인
  useEffect(() => {
    if (!email || !emailVerified || !profileData || !termsData) {
      navigate('/signup/email');
      return;
    }
  }, [email, emailVerified, profileData, termsData, navigate]);

  // 회원가입 완료 (등록)
  const handleRegister = async () => {
    // TODO: 실제 회원가입 API 호출
    console.warn('회원가입 데이터:', {
      email,
      ...profileData,
      ...termsData,
      ...formData,
    });
    
    // 회원가입 완료 페이지로 이동
    navigate('/signup/complete', {
      state: {
        email,
        name: profileData.name,
      }
    });
  };

  // 건너뛰기
  const handleSkip = async () => {
    // TODO: 응급정보 없이 회원가입 API 호출
    console.warn('회원가입 데이터 (응급정보 제외):', {
      email,
      ...profileData,
      ...termsData,
    });
    
    // 회원가입 완료 페이지로 이동
    navigate('/signup/complete', {
      state: {
        email,
        name: profileData.name,
      }
    });
  };

  return (
    <Container>
      <Header>
        <BackButton onClick={() => navigate(-1)}>
          ←
        </BackButton>
        
        <ProgressBar>
          <ProgressFill progress={100} />
        </ProgressBar>
        
        <Title>응급 정보를 등록해주세요 (선택)</Title>
        <Subtitle>등록된 연락처로 사고 발생 알림 문자가 전송됩니다.</Subtitle>
      </Header>

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
          style={{
            borderColor: formErrors.emergencyContact1 ? '#ef4444' : undefined,
            borderWidth: formErrors.emergencyContact1 ? '2px' : '1px'
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
          style={{
            borderColor: formErrors.emergencyContact2 ? '#ef4444' : undefined,
            borderWidth: formErrors.emergencyContact2 ? '2px' : '1px'
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
          style={{
            borderColor: formErrors.emergencyContact3 ? '#ef4444' : undefined,
            borderWidth: formErrors.emergencyContact3 ? '2px' : '1px'
          }}
        />
        {formErrors.emergencyContact3 && (
          <ErrorMessage>{formErrors.emergencyContact3}</ErrorMessage>
        )}
      </FormGroup>

      <ButtonGroup>
        <RegisterButton onClick={handleRegister}>
          등록
        </RegisterButton>
      </ButtonGroup>
      
      <SkipButton onClick={handleSkip}>
        건너뛰기
      </SkipButton>
    </Container>
  );
}

export default EmergencyInfoPage;