import * as Styled from './ErrorDisplay.styles';

type PropsType = {
  error: Error;
  onRetry: () => void;
};

export default function ErrorDisplay({ error, onRetry }: PropsType) {
  return (
    <Styled.Wrapper>
      <Styled.Icon>⚠️</Styled.Icon>
      <Styled.Title>OpenDRIVE 파일 로딩 실패</Styled.Title>
      <Styled.Message>{error.message}</Styled.Message>
      <Styled.RetryButton onClick={onRetry}>다시 시도</Styled.RetryButton>
    </Styled.Wrapper>
  );
}
