import { useSignupComplete } from '@hooks/useSignupComplete';
import {
  Container,
  ContentWrapper,
  TitleSection,
  Title,
  Subtitle,
  IllustrationWrapper,
  GiftBox,
  Confetti,
  ConfirmButton,
} from '@components/auth/SignupCompleteStyles';

export function SignupCompletePage() {
  const { name, handleConfirm } = useSignupComplete();

  return (
    <Container>
      <ContentWrapper>
        <TitleSection>
          <Title>
            {name ? `${name}님,` : '스무스님,'}
            <br />
            가입을 축하합니다!
          </Title>
          <Subtitle>
            오늘부터 당신만의
            <br />
            드라이빙 리포트를 만들어보세요
          </Subtitle>
        </TitleSection>

        <IllustrationWrapper>
          <Confetti />
          <GiftBox>🎁</GiftBox>
        </IllustrationWrapper>
      </ContentWrapper>

      <ConfirmButton onClick={handleConfirm}>확인</ConfirmButton>
    </Container>
  );
}

export default SignupCompletePage;
