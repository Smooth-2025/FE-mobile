import * as Styled from './NotFoundPage.style';

export default function NotFoundPage() {
  return (
    <Styled.Main>
      <Styled.Column>
        <Styled.Title>404 NotFound</Styled.Title>
        <Styled.Description>페이지를 찾을 수 없습니다</Styled.Description>
        <Styled.BackButton onClick={() => (window.location.href = '/')}>
          메인으로 돌아가기
        </Styled.BackButton>
      </Styled.Column>
    </Styled.Main>
  );
}
