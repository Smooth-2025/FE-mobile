import { useState, useCallback } from 'react';
import type { ToastProps } from '@components/common/AlertToast/type';

interface ToastState extends ToastProps {
  id: string;
  isVisible: boolean;
}

export const useToast = () => {
  const [toasts, setToasts] = useState<ToastState[]>([]);

  // 토스트 표시
  const showToast = useCallback((props: Omit<ToastProps, 'position'>) => {
    const id = Date.now().toString();
    const newToast: ToastState = {
      id,
      isVisible: true,
      position: 'bottom',
      duration: 3000,
      ...props,
    };
    setToasts(prev => [...prev, newToast]);

    // 지정된 시간 후 토스트 제거
    setTimeout(() => {
      setToasts(prev => prev.filter(toast => toast.id !== id));
    }, (props.duration || 3000) + 600); // 페이드아웃 시간 추가
  }, []);

  // 성공 토스트
  const showSuccess = useCallback((content: string, title?: string) => {
    showToast({ type: 'success', content, title });
  }, [showToast]);
  
  //에러 토스트
  const showError = useCallback((content: string, title?: string) => {
    showToast({ type: 'error', content, title });
  }, [showToast]);

  // 로그인 에러 토스트
  const showLoginError = useCallback((message?: string) => {
    const errorMessage = message || '등록되지 않은 회원정보입니다.';
    showError(errorMessage);
  }, [showError]);
  
  //토스트 제거
  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  // 모든 토스트 제거
  const clearToasts = useCallback(() => {
    setToasts([]);
  }, []);

  return {
    toasts,
    showToast,
    showSuccess,
    showError,
    showLoginError,
    removeToast,
    clearToasts,
  };
};