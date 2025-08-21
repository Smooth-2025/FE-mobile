import { RxStomp, RxStompState, type RxStompConfig } from '@stomp/rx-stomp';
import SockJS from 'sockjs-client';
import { tokenUtils } from '@/utils/token';
import { ConnectionStatus } from './types';
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
import { updateDrivingTendency } from '../slices/drivingSlice';
import type { Middleware } from '@reduxjs/toolkit';
import type { Subscription } from 'rxjs';
import type { IMessage } from '@stomp/stompjs';
import type { AlertType , DrivingTendencyData, DrivingAnimalType } from './types';

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
  
  // payload 내부 확인
  const payload = getAny(obj, 'payload');
  if (payload) {
    const content = getString(payload, 'content');
    if (content) return content;
    const title = getString(payload, 'title');
    if (title) return title;
  }
  
  // 최상위 레벨 확인
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

export const websocketMiddleware: Middleware =
  ({ dispatch }) =>
  (next) =>
  (action) => {
    const result = next(action);

    if (connectWebSocket.match(action)) {
      if (rxStomp) {
        try {
          rxStomp.deactivate();
        } catch (error) {
          console.error('WebSocket deactivation error:', error);
        }
        subscriptions.clear();
      }

      const socket = new SockJS(import.meta.env.VITE_API_BASE_WS_URL);
      const token = tokenUtils.getToken();
      
      if (!token) {
        console.error('❌ 웹소켓 연결 실패: JWT 토큰이 없습니다.');
        dispatch(setConnectionStatus(ConnectionStatus.DISCONNECTED));
        dispatch(setError('JWT 토큰이 없어 웹소켓 연결을 할 수 없습니다.'));
        return result;
      }

      rxStomp = new RxStomp();
      const config: RxStompConfig = {
        webSocketFactory: () => socket,
        connectHeaders: {
          Authorization: `Bearer ${token}`,
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
        try {
          rxStomp.deactivate();
        } catch (error) {
          console.error('WebSocket deactivation error:', error);
        }
        rxStomp = null;
        subscriptions.clear();
        dispatch(setConnectionStatus(ConnectionStatus.DISCONNECTED));
      }
      return result;
    }

    if (subscribeToAlerts.match(action)) {
      const destination = '/user/queue/alert'; 
      if (rxStomp) {
        console.warn(`📩 토픽 구독 시도: ${destination}`);

        const handleReceivedData = (message: IMessage) => {
          try {
            let rawData: unknown;
            try {
              rawData = JSON.parse(message.body);
              console.warn(rawData);
            } catch {
              rawData = message.body;
            }

            // 데이터 타입에 따라 분기 처리
            const dataType = getString(rawData, 'type');
            
            // 주행 성향 데이터 처리
            if (dataType === 'driving_tendency') {
              const payload = getAny(rawData, 'payload');
              if (isRecord(payload)) {
                const userId = getString(payload, 'userId');
                const x = payload.x;
                const y = payload.y;
                const animalType = getString(payload, 'animalType');
                
                if (userId && typeof x === 'number' && typeof y === 'number' && animalType) {
                  const drivingData: DrivingTendencyData = {
                    userId,
                    x,
                    y,
                    animalType: animalType as DrivingAnimalType,
                    timestamp: new Date().toISOString(),
                  };
                  
                  dispatch(updateDrivingTendency(drivingData));
                  console.warn('🚗 주행 성향 데이터 업데이트:', drivingData);
                }
              }
            }
            
            // 알림 데이터 처리 (기존 로직)
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
            const id =
              idFromServer ??
              (globalThis.crypto?.randomUUID?.()
                ? globalThis.crypto.randomUUID()
                : String(Date.now()));
            const payload = getAny(rawData, 'payload');
            const title = getString(payload, 'title');
            const content = getString(payload, 'content');

            dispatch(
              addAlert({
                id,
                type,
                message: display,
                ...(title ? { title } : {}),
                ...(content ? { content } : {}),
                timestamp,
                raw: rawData,
                isRead: false,
              }),
            );
            console.warn('📢 알림 데이터:', type);

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
        rxStomp.publish({
          destination: '/app/test-alert',
          body: JSON.stringify({ type, ...payload }),
        });
        console.warn('📤 테스트 알림 전송:', { type, ...payload });
      }
      return result;
    }

    if (pingWebSocket.match(action)) {
      if (rxStomp) {
        rxStomp.publish({
          destination: '/app/ping',
          body: JSON.stringify({ timestamp: new Date().toISOString() }),
        });
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
