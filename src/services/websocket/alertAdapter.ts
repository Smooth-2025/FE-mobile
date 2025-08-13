import type { ToastType } from '@/components/common/AlertToast/type';
import type { AlertMessage, AlertType } from './types';

const alertTypeMap: Partial<Record<AlertType, ToastType>> = {
  accident: 'error',
  'accident-nearby': 'accident-nearby',
  obstacle: 'obstacle',
  pothole: 'pothole',
  start: 'success',
  end: 'success',
};

// 타입별 기본 타이틀 (title이 없을 때만 사용)
// ✅ Partial로 선언 + 'unknown' 키 제거
const defaultTitleByType: Partial<Record<AlertType, string>> = {
  accident: '사고 발생',
  'accident-nearby': '근처 사고',
  obstacle: '장애물 감지',
  pothole: '포트홀 감지',
  start: '주행 시작',
  end: '주행 종료',
};

// 백엔드 메시지 그대로 보여주기 위한 content 선택 로직
function pickContent(alert: AlertMessage): string {
  // 1순위: 서버 원문 텍스트(message)
  if (alert.message && alert.message.trim().length > 0) return alert.message.trim();

  // 2순위: 서버가 보낸 보조 필드
  if (alert.content && alert.content.trim().length > 0) return alert.content.trim();

  // 3순위: 타임스탬프(START/END 등)
  if (alert.timestamp) return alert.timestamp;

  return '';
}

// 타이틀 선택: 서버 타이틀 우선, 없으면 타입 기반 기본 타이틀 → 그마저도 없으면 '알림'
function pickTitle(alert: AlertMessage): string {
  if (alert.title && alert.title.trim().length > 0) return alert.title.trim();
  return defaultTitleByType[alert.type] ?? '알림';
}

// 웹소켓 알림을 AlertToast props로 변환
export function convertAlertToToast(alert: AlertMessage): ToastProps {
  // ✅ 매핑에 없으면 기본 'info'로
  const toastType: ToastType = alertTypeMap[alert.type] ?? 'info';

  return {
    type: toastType,
    title: pickTitle(alert),
    content: pickContent(alert), // ✅ 백엔드 원문 우선
    position: 'top',
    duration: alert.type === 'start' || alert.type === 'end' ? 3000 : 4000,
  };
}
