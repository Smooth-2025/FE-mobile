import { RxStomp, RxStompState, type RxStompConfig } from '@stomp/rx-stomp';
import SockJS from 'sockjs-client';
import { ConnectionStatus } from '@/services/websocket/types';
import { tokenUtils } from '@/utils/token';
import { setConnectionStatus, setError } from '../slices/websocketSlice';
import { addAlert } from '../slices/alertSlice';
import {
  connectWebSocket,
  disconnectWebSocket,
  subscribeToAlerts,
  unsubscribeFromAlerts,
  sendTestAlert,
  pingWebSocket,
  sendCommand,
} from './websocketActions';
import type { Middleware } from '@reduxjs/toolkit';
import type { Subscription } from 'rxjs';
import type { IMessage } from '@stomp/stompjs';
import type { AlertType } from '../slices/alertSlice';

let rxStomp: RxStomp | null = null;
const subscriptions: Map<string, Subscription> = new Map();

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object';
}
function getString(obj: unknown, key: string): string | undefined {
  if (isRecord(obj)) {
    const v = obj[key];
    return typeof v === 'string' ? v : undefined;
  }
  return undefined;
}
function getAny(obj: unknown, key: string): unknown {
  return isRecord(obj) ? obj[key] : undefined;
}
function parseAlertType(v: unknown): AlertType {
  if (typeof v !== 'string') return 'unknown';
  const allowed: Record<AlertType, true> = {
    accident: true,
    'accident-nearby': true,
    obstacle: true,
    pothole: true,
    start: true,
    end: true,
    unknown: true,
  };
  return (allowed as Record<string, true>)[v] ? (v as AlertType) : 'unknown';
}
function extractDisplayText(obj: unknown): string {
  if (obj === null) return '';
  if (typeof obj === 'string') return obj;
  const message = getString(obj, 'message');
  if (message) return message;
  const content = getString(obj, 'content');
  if (content) return content;
  const title = getString(obj, 'title');
  if (title) return title;
  try {
    return JSON.stringify(obj);
  } catch {
    return String(obj);
  }
}

export const websocketMiddleware: Middleware = ({ dispatch }) => (next) => (action) => {
  const result = next(action);

  if (connectWebSocket.match(action)) {
    if (rxStomp) {
      try { rxStomp.deactivate(); } catch (error) {
        console.error('WebSocket deactivation error:', error);
      }
      subscriptions.clear();
    }

    const socket = new SockJS('/ws');
    const token = tokenUtils.getToken();

    rxStomp = new RxStomp();
    const config: RxStompConfig = {
      webSocketFactory: () => socket,
      connectHeaders: {
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      },
      heartbeatIncoming: 10000,
      heartbeatOutgoing: 10000,
      reconnectDelay: 3000,
      debug: (str) => console.warn('🔍 STOMP Debug:', str),
    };
    rxStomp.configure(config);
    rxStomp.activate();

    rxStomp.connectionState$.subscribe((state) => {
      if (state === RxStompState.OPEN) {
        dispatch(setConnectionStatus(ConnectionStatus.CONNECTED));
        console.warn('✅ STOMP 연결 성공!');
        // 원하면 여기서 자동 재구독
        // dispatch(subscribeToAlerts());
      } else if (state === RxStompState.CLOSED) {
        dispatch(setConnectionStatus(ConnectionStatus.DISCONNECTED));
        subscriptions.clear();
        console.error('❌ STOMP 연결 종료');
      } else if (state === RxStompState.CONNECTING) {
        dispatch(setConnectionStatus(ConnectionStatus.CONNECTING));
      }
    });

    return result;
  }

  if (disconnectWebSocket.match(action)) {
    if (rxStomp) {
      try { rxStomp.deactivate(); } catch (error) {
        console.error('WebSocket deactivation error:', error);
      }
      rxStomp = null;
      subscriptions.clear();
      dispatch(setConnectionStatus(ConnectionStatus.DISCONNECTED));
    }
    return result;
  }

  if (subscribeToAlerts.match(action)) {
    const destination = `/user/queue/alert`; 
    if (rxStomp) {
      console.warn(`📩 알림 토픽 구독 시도: ${destination}`);

      const handleReceivedData = (message: IMessage) => {
        try {
          let rawData: unknown;
          try { rawData = JSON.parse(message.body); } catch { rawData = message.body; }

          const display = extractDisplayText(rawData);
          const type: AlertType = parseAlertType(getAny(rawData, 'type'));
          const timestamp = (() => {
            const ts = getAny(rawData, 'timestamp');
            return typeof ts === 'string' ? ts : new Date().toISOString();
          })();
          const idFromServer = (() => {
            const v = getAny(rawData, 'id');
            return typeof v === 'string' ? v : undefined;
          })();
          const id = idFromServer ?? (globalThis.crypto?.randomUUID?.()
            ? globalThis.crypto.randomUUID()
            : String(Date.now()));
          const title = getString(rawData, 'title');
          const content = getString(rawData, 'content');

          dispatch(addAlert({
            id,
            type,
            message: display,
            ...(title ? { title } : {}),
            ...(content ? { content } : {}),
            timestamp,
            raw: rawData,
            isRead: false,
          }));

          // start 알림일 때 자동으로 /drive 페이지로 이동
          if (type === 'start') {
            // 네비게이션 이벤트 발생
            window.dispatchEvent(new CustomEvent('navigate-to-drive', { 
              detail: { reason: 'driving-start' } 
            }));
            console.warn('🚗 주행 시작 알림 수신 - /drive 페이지로 이동');
          }

          // end 알림일 때 홈으로 이동 (선택사항)
          if (type === 'end') {
            window.dispatchEvent(new CustomEvent('navigate-to-home', { 
              detail: { reason: 'driving-end' } 
            }));
            console.warn('🏠 주행 종료 알림 수신 - 홈으로 이동');
          }

          if (typeof Notification !== 'undefined' && Notification.permission === 'granted') {
            new Notification(title || '📢 알림', { body: display, icon: '/favicon.ico' });
          }
        } catch (error) {
          console.error('❌ 메시지 처리 오류:', error);
          dispatch(setError((error as Error)?.message ?? 'message handling error'));
        }
      };

      const sub = rxStomp.watch(destination).subscribe(handleReceivedData);
      subscriptions.set(destination, sub);
      console.warn('✅ 알림 토픽 구독 완료');
    }
    return result;
  }

  if (unsubscribeFromAlerts.match(action)) {
    const { destination } = action.payload;
    const sub = subscriptions.get(destination);
    if (sub) {
      sub.unsubscribe();
      subscriptions.delete(destination);
      console.warn(`🔕 구독 해제: ${destination}`);
    }
    return result;
  }

  if (sendTestAlert.match(action)) {
    const { type, payload } = action.payload;
    if (rxStomp) {
      rxStomp.publish({ destination: '/app/test-alert', body: JSON.stringify({ type, ...payload }) });
      console.warn('📤 테스트 알림 전송:', { type, ...payload });
    }
    return result;
  }

  if (pingWebSocket.match(action)) {
    if (rxStomp) {
      rxStomp.publish({ destination: '/app/ping', body: JSON.stringify({ timestamp: new Date().toISOString() }) });
      console.warn('📤 STOMP PING 메시지 전송');
    }
    return result;
  }

  if (sendCommand.match?.(action)) {
    const { command, data } = action.payload;
    if (rxStomp) {
      rxStomp.publish({ destination: command, body: JSON.stringify(data ?? {}) });
      console.warn('📤 커맨드 전송:', { command, data });
    }
    return result;
  }

  return result;
};

export default websocketMiddleware;
