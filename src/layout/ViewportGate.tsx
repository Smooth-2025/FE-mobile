import styled from '@emotion/styled';
import { VIEWPORT_MAX_WIDTH, VIEWPORT_MIN_WIDTH } from '@/constants/viewPort';
import { useViewportRangeGate } from '@/hooks/useViewportRangeGate';
import type { ReactNode } from 'react';

const Blocked = styled.div`
  min-height: 100dvh;
  display: flex;
  align-items: center;
  justify-content: center;
`;
const Card = styled.div`
  width: 100%;
  max-width: 560px;
  border-radius: 16px;
  padding: 24px;
  background: ${({ theme }) => theme.colors?.bg_page ?? '#111'};
  color: ${({ theme }) => theme?.colors?.primary600 ?? '#fff'};
  h1 {
    font-size: 20px;
    margin: 0 0 12px;
  }
  p,
  li {
    line-height: 1.6;
  }
`;

type Props = { children: ReactNode };

export default function ViewportGate({ children }: Props) {
  const allowed = useViewportRangeGate(VIEWPORT_MIN_WIDTH, VIEWPORT_MAX_WIDTH);
  if (allowed) return <>{children}</>;

  return (
    <Blocked role="region" aria-label="지원 화면 크기 안내">
      <Card>
        <h1>지원하지 않는 화면 크기</h1>
        <p>
          우리 서비스는{' '}
          <strong>
            {VIEWPORT_MIN_WIDTH}px 이상 ~ {VIEWPORT_MAX_WIDTH}px 이하
          </strong>
          에서만 이용할 수 있어요.
        </p>
        <ul>
          <li>스마트폰/태블릿 폭으로 맞춰 접속해 주세요.</li>
          <li>데스크톱은 폭을 줄여도 {VIEWPORT_MAX_WIDTH}px 초과면 차단돼요.</li>
        </ul>
      </Card>
    </Blocked>
  );
}
