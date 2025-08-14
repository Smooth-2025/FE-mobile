import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTermsAgreement } from '@hooks/useTermsAgreement';
import { TERMS_CONTENT } from '@constants/termsContent';
import {
  Container,
  Header,
  BackButton,
  ProgressBar,
  ProgressFill,
  Title,
  Subtitle,
  AgreementSection,
  AgreementItem,
  AllAgreementItem,
  CheckboxWrapper,
  Checkbox,
  CheckboxLabel,
  TermsContent,
  TermsLink,
  ConfirmButton,
} from '@components/auth/TermsAgreementStyles';

export function TermsAgreementPage() {
  const navigate = useNavigate();
  const location = useLocation();
  
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

  // 이전 단계 데이터 확인
  useEffect(() => {
    if (!email || !emailVerified || !profileData) {
      navigate('/signup/email');
      return;
    }
  }, [email, emailVerified, profileData, navigate]);

  // 다음 단계로
  const handleConfirm = () => {
    if (isAllRequiredAgreed) {
      navigate('/signup/emergency', {
        state: {
          email,
          emailVerified,
          profileData,
          termsData: {
            termsOfServiceAgreed: agreements.termsOfService,
            privacyPolicyAgreed: agreements.privacyPolicy,
          },
        }
      });
    }
  };

  return (
    <Container>
      <Header>
        <BackButton onClick={() => navigate(-1)}>
          ←
        </BackButton>
        
        <ProgressBar>
          <ProgressFill progress={75} />
        </ProgressBar>
        
        <Title>스무스가 처음이시군요!</Title>
        <Subtitle>약관내용에 동의해주세요.</Subtitle>
      </Header>

      <AgreementSection>
        {/* 전체 동의 */}
        <AllAgreementItem>
          <CheckboxWrapper>
            <Checkbox
              type="checkbox"
              checked={agreements.allAgreed}
              onChange={(e) => handleAllAgreementChange(e.target.checked)}
            />
            <CheckboxLabel isAll>약관 전체 동의</CheckboxLabel>
          </CheckboxWrapper>
        </AllAgreementItem>

        {/* 이용약관 */}
        <AgreementItem>
          <CheckboxWrapper>
            <Checkbox
              type="checkbox"
              checked={agreements.termsOfService}
              onChange={handleIndividualAgreementChange('termsOfService')}
            />
            <CheckboxLabel>
              이용약관 <TermsLink>(필수)</TermsLink>
            </CheckboxLabel>
          </CheckboxWrapper>
          
          <TermsContent>
            {TERMS_CONTENT.termsOfService}
          </TermsContent>
        </AgreementItem>

        {/* 개인정보 처리방침 */}
        <AgreementItem>
          <CheckboxWrapper>
            <Checkbox
              type="checkbox"
              checked={agreements.privacyPolicy}
              onChange={handleIndividualAgreementChange('privacyPolicy')}
            />
            <CheckboxLabel>
              개인정보 처리방침 <TermsLink>(필수)</TermsLink>
            </CheckboxLabel>
          </CheckboxWrapper>
          
          <TermsContent>
            {TERMS_CONTENT.privacyPolicy}
          </TermsContent>
        </AgreementItem>
      </AgreementSection>

      <ConfirmButton
        disabled={!isAllRequiredAgreed}
        onClick={handleConfirm}
      >
        확인
      </ConfirmButton>
    </Container>
  );
}

export default TermsAgreementPage;