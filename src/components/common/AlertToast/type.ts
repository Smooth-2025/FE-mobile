export type ToastPosition = 'top' | 'bottom';
export type ToastType = 'success' | 'error' | 'accident-nearby' | 'obstacle' | 'pothole';
export type ToastIconType = 'checkmarkCircle' | 'warningCircle' | 'warningTriangle';

export type ToastProps = {
  type: ToastType;
  title?: string;
  content: string;
  position?: ToastPosition;
  duration?: number;
};
