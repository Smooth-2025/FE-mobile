import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTermsAgreement } from '@hooks/useTermsAgreement';
import Header from '@layout/Header';
import { useAppDispatch, useAppSelector } from '@hooks/useAppRedux';
import { 
  setSignupStep, 
  nextSignupStep,
  selectSignupCurrentStep 
} from '@store/slices/authSlice';
import { StepProgressBar } from '@components/auth/StepProgressBar';
import { TERMS_CONTENT } from '@constants/termsContent';
import {
  Container,
  Content,
  Title,
  Subtitle,
  AgreementSection,
  AgreementItem,
  AllAgreementItem,
  CheckboxWrapper,
  HiddenCheckbox,
  CustomCheckbox,
  CheckboxLabel,
  TermsContent,
  TermsLink,
  ConfirmButton,
} from '@components/auth/TermsAgreementStyles';

export function TermsAgreementPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const currentStep = useAppSelector(selectSignupCurrentStep);

  // 이전 단계 데이터 가져오기
  const email = location.state?.email;
  const emailVerified = location.state?.emailVerified;
  const profileData = location.state?.profileData;

  // 커스텀 훅 사용
  const {
    agreements,
    handleAllAgreementChange,
    handleIndividualAgreementChange,
    isAllRequiredAgreed,
  } = useTermsAgreement();

  // 이전 단계 데이터 확인 및 스텝 설정
  useEffect(() => {
    if (!email || !emailVerified || !profileData) {
      navigate('/signup/email');
      return;
    }
    
    // 현재 스텝 설정 (약관동의는 3단계)
    dispatch(setSignupStep(3));
  }, [email, emailVerified, profileData, navigate, dispatch]);

  // 다음 단계로
  const handleConfirm = () => {
    if (isAllRequiredAgreed) {
      dispatch(nextSignupStep()); // 4단계로 변경
      navigate('/signup/emergency', {
        state: {
          email,
          emailVerified,
          profileData,
          termsData: {
            termsOfServiceAgreed: agreements.termsOfService,
            privacyPolicyAgreed: agreements.privacyPolicy,
          },
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

          <Title>스무스가 처음이시군요! <br />
            약관내용에 동의해주세요.</Title>
          <Subtitle></Subtitle>

      <AgreementSection>
        {/* 전체 동의 */}
        <AllAgreementItem>
          <CheckboxWrapper>
            <HiddenCheckbox
              type="checkbox"
              checked={agreements.allAgreed}
              onChange={(e) => handleAllAgreementChange(e.target.checked)}
            />
            <CustomCheckbox checked={agreements.allAgreed} />
            <CheckboxLabel isAll>약관 전체 동의</CheckboxLabel>
          </CheckboxWrapper>
        </AllAgreementItem>

        {/* 이용약관 */}
        <AgreementItem>
          <CheckboxWrapper>
            <HiddenCheckbox
              type="checkbox"
              checked={agreements.termsOfService}
              onChange={(e) => handleIndividualAgreementChange('termsOfService')(e.target.checked)}
            />
            <CustomCheckbox checked={agreements.termsOfService} />
            <CheckboxLabel>
              이용약관 <TermsLink>(필수)</TermsLink>
            </CheckboxLabel>
          </CheckboxWrapper>

          <TermsContent>{TERMS_CONTENT.termsOfService}</TermsContent>
        </AgreementItem>

        {/* 개인정보 처리방침 */}
        <AgreementItem>
          <CheckboxWrapper>
            <HiddenCheckbox
              type="checkbox"
              checked={agreements.privacyPolicy}
              onChange={(e) => handleIndividualAgreementChange('privacyPolicy')(e.target.checked)}
            />
            <CustomCheckbox checked={agreements.privacyPolicy} />
            <CheckboxLabel>
              개인정보 처리방침 <TermsLink>(필수)</TermsLink>
            </CheckboxLabel>
          </CheckboxWrapper>

          <TermsContent>{TERMS_CONTENT.privacyPolicy}</TermsContent>
        </AgreementItem>
      </AgreementSection>

      <ConfirmButton disabled={!isAllRequiredAgreed} onClick={handleConfirm}>
        확인
      </ConfirmButton>
        </Content>
      </Container>
    </>
  );
}

export default TermsAgreementPage;
