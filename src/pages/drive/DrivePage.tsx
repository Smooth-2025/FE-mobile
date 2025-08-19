import styled from '@emotion/styled';
import Header from '@/layout/Header';
import { theme } from '@/styles/theme';

const TestSection = styled.div`
  margin-top: 20px;
  padding: 16px;
  background: #fffbeb;
  border-radius: 12px;
  border: 1px solid #fbbf24;
`;

const TestButton = styled.button`
  margin: 4px;
  padding: 8px 16px;
  background: ${theme.colors.primary600};
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 12px;
  cursor: pointer;

  &:hover {
    background: ${theme.colors.primary700};
  }
`;

export default function DrivePage() {
  // 백엔드 테스트 API 호출
  const testAlert = async (type: string) => {
    try {
      const latitude = 37.5665; // 서울 시청 좌표
      const longitude = 126.978;
      const userId = 'test-user-123'; // JWT 토큰과 동일한 userId 사용

      const response = await fetch(`/api/test/${type}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          userId: userId,
          latitude: latitude.toString(),
          longitude: longitude.toString(),
        }),
      });

      const result = await response.json();
      if (result.status === 'success') {
        console.warn(`${type} 테스트 성공:`, result);
      } else {
        console.error(`${type} 테스트 실패:`, result);
      }
    } catch (error) {
      console.error(`${type} 테스트 오류:`, error);
    }
  };

  return (
    <main>
      <Header type="logo" bgColor={theme.colors.bg_page} />

      <div style={{ padding: '16px' }}>
        {/* 개발용 테스트 섹션만 유지 */}
        {process.env.NODE_ENV === 'development' && (
          <TestSection>
            <h4 style={{ margin: '0 0 12px 0', color: '#92400e' }}>🧪 백엔드 API 테스트</h4>
            <div>
              <TestButton onClick={() => testAlert('accident')}>사고 알림 테스트</TestButton>
              <TestButton onClick={() => testAlert('obstacle')}>장애물 알림 테스트</TestButton>
              <TestButton onClick={() => testAlert('pothole')}>포트홀 알림 테스트</TestButton>
              <TestButton onClick={() => testAlert('simple-message')}>
                간단 메시지 테스트
              </TestButton>
            </div>
            <p style={{ margin: '8px 0 0 0', fontSize: '12px', color: '#92400e' }}>
              * 개발 환경에서만 표시됩니다
            </p>
          </TestSection>
        )}
      </div>
    </main>
  );
}
