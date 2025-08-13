import { RxStomp, RxStompState } from '@stomp/rx-stomp';
import SockJS from 'sockjs-client';
import { ConnectionStatus } from '../../services/websocket/types';
import { setConnectionStatus, addAlert } from '../slices/alertSlice';
import type { Middleware } from '@reduxjs/toolkit';
import type { IMessage, StompConfig } from '@stomp/stompjs';
import type { Subscription } from 'rxjs';
import type { WebSocketAction } from './websocketActions';

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

/** 화면에 보여줄 문자열만 추출 (우선순위: message > content > title > JSON) */
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

const websocketMiddleware: Middleware = ({ dispatch }) => {
  return (next) => (action: WebSocketAction) => {
    switch (action.type) {
      case 'websocket/connect': {
        if (rxStomp) {
          rxStomp.deactivate();
          subscriptions.clear();
        }

        // 프록시(/ws)로 SockJS 연결
        const socket = new SockJS('/ws');
        rxStomp = new RxStomp();

        const config: StompConfig = {
          webSocketFactory: () => socket,
          heartbeatIncoming: 10000,
          heartbeatOutgoing: 10000,
          reconnectDelay: 3000,
          debug: (str) => {
            console.error('🔍 STOMP Debug:', str);
          },
        };

        rxStomp.configure(config);
        rxStomp.activate();

        rxStomp.connectionState$.subscribe((state) => {
          if (state === RxStompState.OPEN) {
            dispatch(setConnectionStatus(ConnectionStatus.CONNECTED));
            console.error('✅ STOMP 연결 성공!');
          } else if (state === RxStompState.CLOSED) {
            dispatch(setConnectionStatus(ConnectionStatus.DISCONNECTED));
            subscriptions.clear();
            console.error('❌ STOMP 연결 종료');
          } else if (state === RxStompState.CONNECTING) {
            dispatch(setConnectionStatus(ConnectionStatus.CONNECTING));
          }
        });
        break;
      }

      case 'websocket/disconnect': {
        if (rxStomp) {
          rxStomp.deactivate();
          rxStomp = null;
          subscriptions.clear();
          dispatch(setConnectionStatus(ConnectionStatus.DISCONNECTED));
        }
        break;
      }

      case 'websocket/subscribe': {
        const { userId } = action.payload;
        const destination = `/user/${userId}/alert`;

        if (rxStomp && rxStomp.connected()) {
          console.error(`📩 알림 토픽 구독 시도: ${destination}`);

          const handleReceivedData = (message: IMessage) => {
            console.error('🎯 알림 메시지 수신!', message);

            try {
              console.error('📩 STOMP 메시지 수신:', message.body);
              let rawData: unknown;
              try {
                rawData = JSON.parse(message.body);
              } catch {
                rawData = message.body; // 문자열인 경우 그대로
              }
              console.error('🚨 알림 데이터 파싱 OK:', rawData);

              // 표시 텍스트
              const display = extractDisplayText(rawData);

              // 서버 필드 안전 추출
              const type =
                ((): string => {
                  const t = getAny(rawData, 'type');
                  return typeof t === 'string' ? t : 'start';
                })();

              const timestamp =
                ((): string => {
                  const ts = getAny(rawData, 'timestamp');
                  return typeof ts === 'string' ? ts : new Date().toISOString();
                })();

              const idFromServer =
                ((): string | undefined => {
                  const id = getAny(rawData, 'id');
                  return typeof id === 'string' ? id : undefined;
                })();

              const id =
                idFromServer ??
                (globalThis.crypto?.randomUUID?.() ? globalThis.crypto.randomUUID() : String(Date.now()));

              const title = getString(rawData, 'title');
              const content = getString(rawData, 'content');

              // 알림 엔티티: 원문은 raw에 보존, 화면에는 message를 그대로 사용
              const alertData = {
                id,
                type: type as unknown, // 프로젝트의 AlertType 합치려면 매핑 필요 시 추가
                message: display,  // ✅ 백엔드 메시지 그대로(우선순위 추출)
                ...(title ? { title } : {}),
                ...(content ? { content } : {}),
                timestamp,
                raw: rawData,    
                isRead: false,
              };

              dispatch(addAlert(alertData));

              // (웹 전용) 브라우저 알림
              if (typeof Notification !== 'undefined' && Notification.permission === 'granted') {
                const notifTitle = title || '📢 알림';
                const notifBody = display;
             
                new Notification(notifTitle, { body: notifBody, icon: '/favicon.ico' });
              }
            } catch (error) {
              console.error('❌ 메시지 처리 오류:', error);
            }
          };

          const subscription = rxStomp.watch(destination).subscribe(handleReceivedData);
          subscriptions.set(destination, subscription);
          console.error('✅ 알림 토픽 구독 완료');
        }
        break;
      }

      case 'websocket/unsubscribe': {
        const { destination } = action.payload;
        const subscription = subscriptions.get(destination);
        if (subscription) {
          subscription.unsubscribe();
          subscriptions.delete(destination);
          console.error(`🔕 구독 해제: ${destination}`);
        }
        break;
      }

      case 'websocket/sendTestAlert': {
        const { type, payload } = action.payload;
        if (rxStomp && rxStomp.connected()) {
          const destination = '/app/test-alert';
          const data = { type, ...payload };

          rxStomp.publish({
            destination,
            body: JSON.stringify(data),
          });
          console.error('📤 테스트 알림 전송:', data);
        }
        break;
      }

      case 'websocket/ping': {
        if (rxStomp && rxStomp.connected()) {
          rxStomp.publish({
            destination: '/app/ping',
            body: JSON.stringify({ timestamp: new Date().toISOString() }),
          });
          console.error('📤 STOMP PING 메시지 전송');
        }
        break;
      }

      default:
        break;
    }

    return next(action);
  };
};

export default websocketMiddleware;
