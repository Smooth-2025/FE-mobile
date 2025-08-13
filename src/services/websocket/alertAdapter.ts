import type { AlertMessage, AlertType } from './types';
import type { ToastProps, ToastType } from '../../components/common/AlertToast/types';

// 웹소켓 AlertType을 AlertToast ToastType으로 매핑
const alertTypeMap: Record<AlertType, ToastType> = {
  accident: 'error',
  'accident-nearby': 'accident-nearby',
  obstacle: 'obstacle',
  pothole: 'pothole',
  start: 'success',
  end: 'success',
};

// 웹소켓 알림을 AlertToast props로 변환
export function convertAlertToToast(alert: AlertMessage): ToastProps {
  const toastType = alertTypeMap[alert.type];

  if ('title' in alert) {
    // 일반 알림 (title, content 있음)
    return {
      type: toastType,
      title: alert.title,
      content: alert.content,
      position: 'top',
      duration: 4000,
    };
  } else if ('timestamp' in alert) {
    // 시간 알림 (start/end)
    const title = alert.type === 'start' ? '주행 시작' : '주행 종료';
    return {
      type: toastType,
      title,
      content: alert.timestamp,
      position: 'top',
      duration: 3000,
    };
  }

  // 기본값
  return {
    type: 'error',
    title: '알림',
    content: '알 수 없는 알림입니다.',
    position: 'top',
    duration: 3000,
  };
}
