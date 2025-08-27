import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  startDrivingSession,
  endDrivingSession,
  updateDrivingTendency,
  selectIsDrivingActive,
} from '@/store/slices/drivingSlice';
import type { DrivingTendencyData } from '@/store/websocket/types';

type Options = {
  data: DrivingTendencyData[];
  tickMs?: number; // 기본 1000ms
  autostart?: boolean; // 마운트 시 자동 start
  loop?: boolean; // 끝까지 가면 처음으로 루프
};

export default function useDumiPlayback({
  data,
  tickMs = 1000,
  autostart = true,
  loop = false,
}: Options) {
  const dispatch = useDispatch();
  const isActive = useSelector(selectIsDrivingActive);

  const idxRef = useRef(0);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (!autostart) return;
    if (!isActive) {
      dispatch(startDrivingSession());
    }
  }, [autostart, isActive, dispatch]);

  useEffect(() => {
    if (!isActive) return;
    if (data.length === 0) return;

    idxRef.current = 0;
    dispatch(updateDrivingTendency(data[0]));

    timerRef.current = window.setInterval(() => {
      const next = idxRef.current + 1;

      if (next < data.length) {
        idxRef.current = next;
        dispatch(updateDrivingTendency(data[next]));
      } else if (loop) {
        idxRef.current = 0;
        dispatch(updateDrivingTendency(data[0]));
      } else {
        if (timerRef.current) {
          window.clearInterval(timerRef.current);
          timerRef.current = null;
        }
        dispatch(endDrivingSession());
      }
    }, tickMs);

    return () => {
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [isActive, tickMs, loop, data, dispatch]);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
        timerRef.current = null;
      }
      if (isActive) {
        dispatch(endDrivingSession());
      }
    };
  }, [dispatch, isActive]);
}
