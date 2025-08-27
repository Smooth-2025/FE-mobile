import { RxStomp, RxStompState, type RxStompConfig } from '@stomp/rx-stomp';
import SockJS from 'sockjs-client';
import { tokenUtils } from '@/utils/token';
import { ConnectionStatus } from './types';
import { setConnectionStatus, setError } from '../slices/websocketSlice';
import { addAlert } from '../slices/alertSlice';
import {
  connectWebSocket,
  disconnectWebSocket,
  subscribeToDriving,
  unsubscribeFromDriving,
  subscribeToIncident,
  unsubscribeFromIncident,
  sendTestAlert,
  pingWebSocket,
  sendCommand,
} from './websocketActions';
import { updateDrivingTendency } from '../slices/drivingSlice';
import type { Middleware } from '@reduxjs/toolkit';
import type { Subscription } from 'rxjs';
import type { IMessage } from '@stomp/stompjs';
import type { AlertType , DrivingTendencyData, NeighborData } from './types';

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
          // 자동 구독은 useWebSocket에서 처리
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


    if (subscribeToDriving.match(action)) {
      const destination = '/user/queue/driving';
      if (rxStomp) {
        console.warn(`📩 주행 성향 토픽 구독 시도: ${destination}`);

        const handleDrivingData = (message: IMessage) => {
          try {
            let rawData: unknown;
            try {
              rawData = JSON.parse(message.body);
              console.warn(rawData);
            } catch {
              rawData = message.body;
            }

            if (isRecord(rawData)) {
              const type = getString(rawData, 'type');
              const payload = getAny(rawData, 'payload');
              
              if (type === 'driving' && isRecord(payload)) {
                const timestamp = getString(payload, 'timestamp');
                const ego = getAny(payload, 'ego');
                const neighbors = getAny(payload, 'neighbors');
                
                if (timestamp && isRecord(ego) && Array.isArray(neighbors)) {
                  const egoUserId = ego.userId;
                  const egoPose = getAny(ego, 'pose');
                  
                  if ((typeof egoUserId === 'number' || typeof egoUserId === 'string') && isRecord(egoPose)) {
                    const validNeighbors: NeighborData[] = neighbors
                      .filter((neighbor: unknown): neighbor is NeighborData => {
                        if (!isRecord(neighbor)) return false;
                        const userId = neighbor.userId;
                        const character = neighbor.character;
                        const pose = neighbor.pose;
                        
                        return (
                          (typeof userId === 'number' || typeof userId === 'string') &&
                          typeof character === 'string' &&
                          ['lion', 'dolphin', 'meerkat', 'cat'].includes(character) &&
                          isRecord(pose) &&
                          typeof pose.latitude === 'number' &&
                          typeof pose.longitude === 'number' &&
                          typeof pose.yaw === 'number'
                        );
                      });

                    const drivingData: DrivingTendencyData = {
                      type: 'driving',
                      timestamp,
                      ego: {
                        userId: egoUserId,
                        pose: {
                          latitude: egoPose.latitude as number,
                          longitude: egoPose.longitude as number,
                          yaw: egoPose.yaw as number,
                        },
                      },
                      neighbors: validNeighbors,
                    };
                    
                    dispatch(updateDrivingTendency(drivingData));
                    console.warn('🚗 주행 성향 데이터 업데이트:', drivingData);
                  }
                }
              }
            }
          } catch (error) {
            console.error('❌ 주행 데이터 처리 오류:', error);
            dispatch(setError((error as Error)?.message ?? 'driving data handling error'));
          }
        };

        const sub = rxStomp.watch(destination).subscribe(handleDrivingData);
        subscriptions.set(destination, sub);
        console.warn('✅ 주행 성향 토픽 구독 완료');
      }
      return result;
    }

    if (subscribeToIncident.match(action)) {
      const destination = '/user/queue/incident';
      if (rxStomp) {
        console.warn(`📩 사고 알림 토픽 구독 시도: ${destination}`);

        const handleIncidentData = (message: IMessage) => {
          try {
            let rawData: unknown;
            try {
              rawData = JSON.parse(message.body);
              console.warn(rawData);
            } catch {
              rawData = message.body;
            }
            
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
            console.warn('🚨 사고 알림 데이터:', type);

            if (typeof Notification !== 'undefined' && Notification.permission === 'granted') {
              new Notification(title || '🚨 사고 알림', { body: display, icon: '/favicon.ico' });
            }
          } catch (error) {
            console.error('❌ 사고 알림 처리 오류:', error);
            dispatch(setError((error as Error)?.message ?? 'incident handling error'));
          }
        };

        const sub = rxStomp.watch(destination).subscribe(handleIncidentData);
        subscriptions.set(destination, sub);
        console.warn('✅ 사고 알림 토픽 구독 완료');
      }
      return result;
    }


    if (unsubscribeFromDriving.match(action)) {
      const { destination } = action.payload;
      const sub = subscriptions.get(destination);
      if (sub) {
        sub.unsubscribe();
        subscriptions.delete(destination);
        console.warn(`🔕 주행 성향 구독 해제: ${destination}`);
      }
      return result;
    }

    if (unsubscribeFromIncident.match(action)) {
      const { destination } = action.payload;
      const sub = subscriptions.get(destination);
      if (sub) {
        sub.unsubscribe();
        subscriptions.delete(destination);
        console.warn(`🔕 사고 알림 구독 해제: ${destination}`);
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
