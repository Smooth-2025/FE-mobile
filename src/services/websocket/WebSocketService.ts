import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import { getWebSocketConfig } from './WebSocketConfig';
import { ConnectionStatus } from './types';
import api from '../../apis/index';
import type { AlertMessage, WebSocketCallbacks, WebSocketConfig } from './types';
import type { IMessage } from '@stomp/stompjs';

class WebSocketService {
  private stompClient: Client | null = null;
  private connectionStatus: ConnectionStatus = ConnectionStatus.DISCONNECTED;
  private reconnectAttempts: number = 0;
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  private callbacks: WebSocketCallbacks = {};
  private config: WebSocketConfig;
  private userId: string | null = null;

  constructor() {
    this.config = getWebSocketConfig();
  }

  public updateConfig(newConfig: Partial<WebSocketConfig>) {
    this.config = { ...this.config, ...newConfig };
  }

  private setConnectionStatus(status: ConnectionStatus) {
    this.connectionStatus = status;
    this.callbacks.onStatusChange?.(status);
  }

  public setCallbacks(callbacks: WebSocketCallbacks) {
    this.callbacks = { ...this.callbacks, ...callbacks };
  }

  private async getJwtToken(userId: string): Promise<string> {
    try {
      const response = (await api.post('/api/dev/test-token', null, {
        params: { userId },
      })) as { token: string };
      return response.token;
    } catch (error) {
      console.error('❌ JWT 토큰 생성 실패:', error);
      throw new Error('JWT 토큰 생성 실패');
    }
  }

  public async connect(userId: string): Promise<void> {
    if (
      this.connectionStatus === ConnectionStatus.CONNECTING ||
      this.connectionStatus === ConnectionStatus.CONNECTED
    ) {
      return;
    }

    this.userId = userId;
    this.setConnectionStatus(ConnectionStatus.CONNECTING);

    try {
      // JWT 토큰 생성
      const jwtToken = await this.getJwtToken(userId);

      return new Promise((resolve, reject) => {
        // SockJS 소켓 생성
        const socket = new SockJS(this.config.wsUrl);

        // STOMP 클라이언트 생성
        this.stompClient = new Client({
          webSocketFactory: () => socket,
          connectHeaders: {
            Authorization: `Bearer ${jwtToken}`,
            userId: userId,
          },
          debug: (str) => {
            console.error('🔍 STOMP Debug:', str);
          },
          reconnectDelay: this.config.reconnectInterval,
          heartbeatIncoming: 4000,
          heartbeatOutgoing: 4000,
        });

        // 연결 성공 콜백
        this.stompClient.onConnect = (frame) => {
          console.error('✅ STOMP 연결 성공!', frame);
          this.setConnectionStatus(ConnectionStatus.CONNECTED);
          this.reconnectAttempts = 0;

          // 알림 토픽 구독
          this.subscribeToAlerts(userId);

          // ping 메시지 전송 (연결 테스트)
          setTimeout(() => {
            this.sendPingMessage(userId);
          }, 1000);

          this.callbacks.onConnect?.();
          resolve();
        };

        // 연결 에러 콜백
        this.stompClient.onStompError = (frame) => {
          console.error('❌ STOMP 에러:', frame.headers['message']);
          console.error('❌ STOMP 에러 상세:', frame.body);
          this.setConnectionStatus(ConnectionStatus.ERROR);
          this.callbacks.onError?.(new Error(frame.headers['message']));
          reject(new Error(frame.headers['message']));
        };

        // WebSocket 에러 콜백
        this.stompClient.onWebSocketError = (error) => {
          console.error('❌ WebSocket 에러:', error);
          this.setConnectionStatus(ConnectionStatus.ERROR);
          this.callbacks.onError?.(error);
          this.handleReconnect();
        };

        // 연결 해제 콜백
        this.stompClient.onDisconnect = () => {
          this.setConnectionStatus(ConnectionStatus.DISCONNECTED);
          this.callbacks.onDisconnect?.();
          this.handleReconnect();
        };

        // 연결 시작
        this.stompClient.activate();
      });
    } catch (error) {
      console.error('❌ STOMP 연결 설정 실패:', error);
      this.setConnectionStatus(ConnectionStatus.ERROR);
      throw error;
    }
  }
  private subscribeToAlerts(userId: string) {
    if (!this.stompClient || !this.stompClient.connected) {
      console.warn('⚠️ STOMP 클라이언트가 연결되지 않음 - 구독 실패');
      return;
    }

    const destination = `/user/${userId}/alert`;
    console.error(`📩 알림 토픽 구독 시도: ${destination}`);

    this.stompClient.subscribe(destination, (message: IMessage) => {
      console.error('🎯 알림 메시지 수신!', message);
      this.handleMessage(message);
    });

    console.error('✅ 알림 토픽 구독 완료');
  }

  private sendPingMessage(userId: string) {
    if (!this.stompClient || !this.stompClient.connected) {
      console.warn('⚠️ STOMP 클라이언트가 연결되지 않음 - ping 전송 실패');
      return;
    }

    const pingBody = {
      message: 'ping from sockjs + stomp',
      userId,
      timestamp: Date.now(),
    };

    this.stompClient.publish({
      destination: '/app/ping',
      body: JSON.stringify(pingBody),
      headers: {
        'user-id': userId,
        'content-type': 'application/json',
      },
    });

    console.error('📤 STOMP PING 메시지 전송');
  }

  private handleMessage(message: IMessage) {
    try {
      console.error('📩 STOMP 메시지 수신:', message.body);

      const rawData = JSON.parse(message.body);
      console.error('🚨 알림 데이터 파싱 성공:', rawData);

      // 백엔드에서 title/content가 없는 경우 프론트엔드에서 매핑
      const getAlertMessage = (type: string) => {
        switch (type) {
          case 'pothole':
            return {
              title: '포트홀 발견',
              content: '전방에 포트홀이 있습니다. 속도를 줄이고 주의해서 주행하세요.',
            };
          case 'accident':
            return {
              title: '큰 사고가 발생했습니다!',
              content: '차량에 큰 사고가 감지되었습니다. 부상이 있다면 즉시 구조를 요청하세요.',
            };
          case 'accident-nearby':
            return {
              title: '전방 사고 발생',
              content: '근처 차량에서 큰 사고가 발생했습니다. 안전 운전하세요.',
            };
          case 'obstacle':
            return {
              title: '전방 장애물 발견',
              content: '전방에 장애물이 있습니다. 주의해서 운전하세요.',
            };
          case 'start':
            return {
              title: '운행 시작',
              content: '안전 운행을 시작합니다.',
            };
          case 'end':
            return {
              title: '운행 종료',
              content: '운행이 종료되었습니다.',
            };
          default:
            return {
              title: '알림',
              content: `${type} 알림이 도착했습니다.`,
            };
        }
      };

      // 백엔드에서 title/content가 있으면 사용, 없으면 프론트엔드에서 매핑
      const hasBackendMessage = rawData.payload?.title && rawData.payload?.content;
      const alertMessage = hasBackendMessage ? null : getAlertMessage(rawData.type);

      const alertData: AlertMessage = {
        type: rawData.type,
        title: rawData.payload?.title || alertMessage?.title || '알림',
        content:
          rawData.payload?.content ||
          alertMessage?.content ||
          `${rawData.type} 알림이 도착했습니다.`,
        timestamp: rawData.payload?.timestamp || new Date().toISOString(),
      };

      

      // 콜백 존재 여부 확인
      console.error('🔍 onAlert 콜백 존재 여부:', !!this.callbacks.onAlert);

      // 알림 콜백 호출
      if (this.callbacks.onAlert) {
        console.error('📞 onAlert 콜백 호출 중...');
        this.callbacks.onAlert(alertData);
      } else {
        console.warn('⚠️ onAlert 콜백이 설정되지 않음');
      }
    } catch (parseError) {
      console.error('❌ JSON 파싱 실패:', parseError);
      console.error('📋 원본 메시지:', message.body);
    }
  }

  public sendVehicleCommand(command: string, data: Record<string, unknown>): boolean {
    if (!this.stompClient || !this.stompClient.connected) {
      console.error('❌ STOMP 클라이언트가 연결되지 않음');
      return false;
    }

    if (!this.userId) {
      console.error('❌ userId가 설정되지 않음');
      return false;
    }

    try {
      const commandBody = { command, data, userId: this.userId };

      this.stompClient.publish({
        destination: '/app/vehicle/command',
        body: JSON.stringify(commandBody),
        headers: {
          'user-id': this.userId,
          'content-type': 'application/json',
        },
      });

      return true;
    } catch (error) {
      console.error('❌ 차량 명령 전송 실패:', error);
      return false;
    }
  }

  private handleReconnect() {
    if (this.reconnectAttempts >= this.config.maxReconnectAttempts) {
      this.setConnectionStatus(ConnectionStatus.ERROR);
      return;
    }

    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
    }

    this.setConnectionStatus(ConnectionStatus.RECONNECTING);
    this.reconnectAttempts++;

    this.reconnectTimer = setTimeout(() => {
      if (!this.userId) {
        console.error('❌ 재연결 시 userId가 없습니다.');
        return;
      }

      this.connect(this.userId).catch((error) => {
        console.error('차량 재연결 실패:', error);
      });
    }, this.config.reconnectInterval);
  }

  public disconnect() {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }

    if (this.stompClient) {
      this.stompClient.deactivate();
      this.stompClient = null;
    }

    this.setConnectionStatus(ConnectionStatus.DISCONNECTED);
    this.reconnectAttempts = 0;
  }

  public getConnectionStatus(): ConnectionStatus {
    return this.connectionStatus;
  }

  public isConnected(): boolean {
    return this.connectionStatus === ConnectionStatus.CONNECTED;
  }

  public reconnect(): Promise<void> {
    if (!this.userId) {
      return Promise.reject(new Error('❌ 재연결 시 userId가 설정되지 않음'));
    }
    this.disconnect();
    return this.connect(this.userId);
  }

  public getConfig(): WebSocketConfig {
    return { ...this.config };
  }

  public getClient(): Client | null {
    return this.stompClient;
  }

  public invokeAlertCallback(message: AlertMessage) {
    this.callbacks.onAlert?.(message);
  }

  // 테스트 알람
  public sendTestAlert(type: string, payload: Record<string, unknown>): boolean {
    if (!this.stompClient || !this.stompClient.connected) {
      console.error('❌ STOMP 클라이언트가 연결되지 않음');
      return false;
    }

    if (!this.userId) {
      console.error('❌ userId가 설정되지 않음');
      return false;
    }

    // payload에 userId 추가 (백엔드에서 필요)
    const messagePayload = {
      ...payload,
      userId: this.userId,
    };

    try {
      const alertBody = {
        type,
        payload: messagePayload,
      };

      this.stompClient.publish({
        destination: '/app/alert',
        body: JSON.stringify(alertBody),
        headers: {
          'user-id': this.userId,
          'content-type': 'application/json',
        },
      });

      return true;
    } catch (error) {
      console.error('❌ 테스트 알림 전송 실패:', error);
      return false;
    }
  }
}

export default new WebSocketService();
