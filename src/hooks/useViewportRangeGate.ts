import { useEffect, useState } from 'react';
import { VIEWPORT_MAX_WIDTH, VIEWPORT_MIN_WIDTH } from '@/constants/viewPort';

export function useViewportRangeGate(min = VIEWPORT_MIN_WIDTH, max = VIEWPORT_MAX_WIDTH) {
  const [allowed, setAllowed] = useState(true);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const evaluate = () => {
      const width = window.innerWidth;
      if (width < min) {
        setAllowed(true);
        return;
      }
      if (width > max) {
        setAllowed(false);
        return;
      }
      setAllowed(true);
    };

    evaluate();
    window.addEventListener('resize', evaluate);
    window.addEventListener('orientationchange', evaluate);

    return () => {
      window.removeEventListener('resize', evaluate);
      window.removeEventListener('orientationchange', evaluate);
    };
  }, [min, max]);

  return allowed;
}
