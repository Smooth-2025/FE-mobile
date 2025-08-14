import { useState, useEffect, useCallback } from 'react';

interface UseCountdownProps {
  initialSeconds: number;
  onComplete?: () => void;
}

export const useCountdown = ({ initialSeconds, onComplete }: UseCountdownProps) => {
  const [seconds, setSeconds] = useState(initialSeconds);
  const [isActive, setIsActive] = useState(false);

  const startTimer = useCallback(() => {
    setSeconds(initialSeconds);
    setIsActive(true);
  }, [initialSeconds]);

  const stopTimer = useCallback(() => {
    setIsActive(false);
    setSeconds(0);
  }, []);

  const resetTimer = useCallback(() => {
    setSeconds(initialSeconds);
    setIsActive(true);
  }, [initialSeconds]);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isActive && seconds > 0) {
      interval = setInterval(() => {
        setSeconds(seconds => {
          if (seconds <= 1) {
            setIsActive(false);
            onComplete?.();
            return 0;
          }
          return seconds - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, seconds, onComplete]);

  // 분:초 형식으로 포맷팅
  const formatTime = useCallback((totalSeconds: number): string => {
    const minutes = Math.floor(totalSeconds / 60);
    const remainingSeconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  }, []);

  return {
    seconds,
    formattedTime: formatTime(seconds),
    isActive,
    isExpired: seconds === 0,
    startTimer,
    stopTimer,
    resetTimer,
  };
};