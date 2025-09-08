import * as Styled from './LoadingIndicator.styles';

export default function LoadingIndicator() {
  return (
    <Styled.Wrapper>
      <Styled.Spinner />
      <Styled.Text>OpenDRIVE 파일을 로딩 중...</Styled.Text>
    </Styled.Wrapper>
  );
}
