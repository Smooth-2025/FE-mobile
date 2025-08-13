export type ToastPosition = 'top' | 'bottom';
export type ToastType = 'success' | 'error' | 'accident' | 'accident-nearby' | 'obstacle' | 'pothole' | 'start' | 'end' | 'unknown';
export type ToastIconType = 'checkmarkCircle' | 'warningCircle' | 'warningTriangle';

export type ToastProps = {
  type: ToastType;
  title?: string;
  content: string;
  position?: ToastPosition;
  duration?: number;
};
