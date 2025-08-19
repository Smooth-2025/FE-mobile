import { createPortal } from 'react-dom';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import * as styled from './BottomSheetPortal.styles';

type BottomSheetChildren = ReactNode | ((helpers: { requestClose: () => void }) => ReactNode);

type BottomSheetPortalProps = {
  isOpen: boolean;
  onClose: () => void;
  children: BottomSheetChildren;
  backdropClosable?: boolean;
  maxHeight?: string;
  swipeToClose?: boolean;
  ariaLabel?: string;
};

export default function BottomSheetPortal({
  isOpen,
  onClose,
  children,
  backdropClosable = true,
  maxHeight = '70dvh',
  swipeToClose = true,
  ariaLabel,
}: BottomSheetPortalProps) {
  const modalRoot = document.getElementById('bottomSheet-root');
  const sheetRef = useRef<HTMLDivElement>(null);

  const [mounted, setMounted] = useState(false);
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setMounted(false);
      setClosing(false);
      return;
    }
    const rafId = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(rafId);
  }, [isOpen]);

  //body 스크롤 잠금
  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isOpen]);

  const requestClose = () => {
    if (!backdropClosable || closing) return;
    const el = sheetRef.current;
    if (el) {
      el.style.transform = '';
      el.style.transition = '';
    }
    setClosing(true);
  };

  const handleBackdrop = () => requestClose();

  const handleTransitionEnd = (e: React.TransitionEvent<HTMLDivElement>) => {
    if (e.propertyName !== 'transform') return;
    if (closing) onClose();
  };

  useEffect(() => {
    if (!swipeToClose) return;
    const el = sheetRef.current;
    if (!el) return;

    let startY = 0;
    let currentY = 0;
    let dragging = false;

    const isTouchLike = (e: PointerEvent) => e.pointerType === 'touch' || e.pointerType === 'pen';

    const onPointerDown = (e: PointerEvent) => {
      if (!isTouchLike(e) || closing) return;
      dragging = true;
      startY = e.clientY;
      currentY = 0;
      el.setPointerCapture(e.pointerId);
      el.style.transition = 'none';
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!dragging) return;
      currentY = Math.max(0, e.clientY - startY);
      el.style.transform = `translateY(${currentY}px)`;
    };

    const onPointerUp = (e: PointerEvent) => {
      if (!dragging) return;
      dragging = false;
      el.releasePointerCapture(e.pointerId);

      const threshold = 20;
      el.style.transition = 'transform 200ms ease';
      if (currentY > threshold) {
        el.style.transform = `translateY(100%)`;
        const done = () => onClose();
        el.addEventListener('transitionend', done, { once: true });
      } else {
        el.style.transform = 'translateY(0)';
      }
    };

    el.addEventListener('pointerdown', onPointerDown);
    el.addEventListener('pointermove', onPointerMove);
    el.addEventListener('pointerup', onPointerUp);
    el.addEventListener('pointercancel', onPointerUp);
    return () => {
      el.removeEventListener('pointerdown', onPointerDown);
      el.removeEventListener('pointermove', onPointerMove);
      el.removeEventListener('pointerup', onPointerUp);
      el.removeEventListener('pointercancel', onPointerUp);
    };
  }, [swipeToClose, onClose, closing]);

  if (!isOpen || !modalRoot) return null;

  return createPortal(
    <styled.Backdrop
      role="presentation"
      onClick={handleBackdrop}
      data-state={closing ? 'closing' : 'open'}
    >
      <styled.Sheet
        ref={sheetRef}
        role="dialog"
        aria-modal="true"
        aria-label={ariaLabel}
        onClick={(e) => e.stopPropagation()}
        data-mounted={mounted ? 'true' : 'false'}
        data-state={closing ? 'closing' : 'open'}
        onTransitionEnd={handleTransitionEnd}
        style={{ maxHeight }}
      >
        <styled.SheetBody>
          {typeof children === 'function' ? children({ requestClose }) : children}
        </styled.SheetBody>
      </styled.Sheet>
    </styled.Backdrop>,
    modalRoot,
  );
}
