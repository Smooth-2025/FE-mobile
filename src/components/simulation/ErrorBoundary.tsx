import React, { Component, type ErrorInfo, type ReactNode } from 'react';
import * as Styled from '@/components/simulation/ErrorBoundary.styles';

interface ErrorBoundaryProps {
  children: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  fallbackMessage?: string;
  showRetry?: boolean;
  onRetry?: () => void;
}

//오류 상태
interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

// 오류 유형별 메시지
const ERROR_MESSAGES = {
  // WebGL 관련 오류
  webgl: {
    keywords: ['webgl', 'context', 'canvas', 'three'],
    message: 'WebGL을 지원하지 않는 브라우저이거나 그래픽 드라이버에 문제가 있습니다.',
    suggestion: '최신 브라우저를 사용하거나 그래픽 드라이버를 업데이트해보세요.',
  },
  // 메모리 관련 오류
  memory: {
    keywords: ['memory', 'allocation', 'out of memory'],
    message: '메모리가 부족하여 3D 시각화를 렌더링할 수 없습니다.',
    suggestion: '다른 탭을 닫거나 더 작은 OpenDRIVE 파일을 사용해보세요.',
  },
  // 데이터 파싱 오류
  parsing: {
    keywords: ['parse', 'xml', 'invalid', 'format'],
    message: 'OpenDRIVE 파일 형식이 올바르지 않거나 손상되었습니다.',
    suggestion: '유효한 OpenDRIVE (.xodr) 파일을 사용하고 있는지 확인해보세요.',
  },
  // 지오메트리 계산 오류
  geometry: {
    keywords: ['geometry', 'calculation', 'coordinate', 'boundary'],
    message: '도로 지오메트리 계산 중 오류가 발생했습니다.',
    suggestion: 'OpenDRIVE 파일의 지오메트리 데이터를 확인해보세요.',
  },
  // 네트워크 오류
  network: {
    keywords: ['fetch', 'network', 'load', 'request'],
    message: '파일을 불러오는 중 네트워크 오류가 발생했습니다.',
    suggestion: '인터넷 연결을 확인하고 파일 경로가 올바른지 확인해보세요.',
  },
  // 기본 오류
  default: {
    keywords: [],
    message: '예상치 못한 오류가 발생했습니다.',
    suggestion: '페이지를 새로고침하거나 다른 파일을 시도해보세요.',
  },
} as const;

//오류 유형을 감지
function detectErrorType(error: Error): keyof typeof ERROR_MESSAGES {
  const errorMessage = error.message.toLowerCase();
  const errorStack = error.stack?.toLowerCase() || '';
  const fullErrorText = `${errorMessage} ${errorStack}`;

  for (const [type, config] of Object.entries(ERROR_MESSAGES)) {
    if (type === 'default') continue;

    const hasKeyword = config.keywords.some((keyword) =>
      fullErrorText.includes(keyword.toLowerCase()),
    );

    if (hasKeyword) {
      return type as keyof typeof ERROR_MESSAGES;
    }
  }

  return 'default';
}

interface ErrorDisplayProps {
  error: Error;
  errorInfo: ErrorInfo;
  onRetry?: () => void;
  showRetry?: boolean;
  fallbackMessage?: string;
}

function ErrorDisplay({
  error,
  errorInfo,
  onRetry,
  showRetry = true,
  fallbackMessage,
}: ErrorDisplayProps): React.JSX.Element {
  const errorType = detectErrorType(error);
  const errorConfig = ERROR_MESSAGES[errorType];

  const displayMessage = fallbackMessage || errorConfig.message;
  const suggestion = errorConfig.suggestion;

  return (
    <Styled.Wrapper>
      <Styled.Icon>⚠️</Styled.Icon>
      <Styled.Title>OpenDRIVE 시각화 오류</Styled.Title>
      <Styled.Message>{displayMessage}</Styled.Message>
      <Styled.Suggestion>💡 {suggestion}</Styled.Suggestion>

      <Styled.Details>
        <Styled.Summary> 세부사항 보기</Styled.Summary>
        <Styled.DetailBox>
          <div>
            <strong>오류:</strong> {error.message}
          </div>
          {error.stack && (
            <div style={{ marginTop: '8px' }}>
              <strong>스택 트레이스:</strong>
              <br />
              {error.stack}
            </div>
          )}
          {errorInfo.componentStack && (
            <div style={{ marginTop: '8px' }}>
              <strong>컴포넌트 스택:</strong>
              <br />
              {errorInfo.componentStack}
            </div>
          )}
        </Styled.DetailBox>
      </Styled.Details>

      <Styled.Actions>
        {showRetry && onRetry && (
          <Styled.RetryButton onClick={onRetry}>다시 시도</Styled.RetryButton>
        )}
        <Styled.RefreshButton onClick={() => window.location.reload()}>
          페이지 새로고침
        </Styled.RefreshButton>
      </Styled.Actions>
    </Styled.Wrapper>
  );
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  //오류가 발생했을 때 상태 업데이트
  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return {
      hasError: true,
      error,
    };
  }

  // 오류 정보캐치 및 로깅
  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    this.setState({
      error,
      errorInfo,
    });

    // 오류 로깅
    console.error('OpenDRIVE ErrorBoundary caught an error:', error);
    console.error('Error info:', errorInfo);

    // 외부 콜백 호출
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  //오류 상태를 리셋
  resetError = (): void => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });

    // 외부 재시도 콜백 호출
    if (this.props.onRetry) {
      this.props.onRetry();
    }
  };

  render(): ReactNode {
    if (this.state.hasError && this.state.error && this.state.errorInfo) {
      return (
        <Styled.FallbackContainer>
          <ErrorDisplay
            error={this.state.error}
            errorInfo={this.state.errorInfo}
            onRetry={this.resetError}
            showRetry={this.props.showRetry}
            fallbackMessage={this.props.fallbackMessage}
          />
        </Styled.FallbackContainer>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
