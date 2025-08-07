import { connect, Socket } from "socket.io-client";

import { IApiService, IApiTokenProvider, SOCKET_BASE_URL } from "~@api";

import { ISocketService, SocketEmitEvents, SocketEvents } from "./Socket.types";

const SOCKET_CONFIG = {
  withCredentials: true,
  autoConnect: true,
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 3000,
  secure: true,
  transports: ["websocket"],
  timeout: 10000,
};

@ISocketService({ inSingleton: true })
export class SocketService implements ISocketService {
  private _socket: Socket | null = null;
  private _listeners: Map<string, (...args: any[]) => void> = new Map();
  private _isManualDisconnect = false;

  constructor(
    @IApiTokenProvider() private _tokenProvider: IApiTokenProvider,
    @IApiService() private _apiService: IApiService,
  ) {}

  get isConnected(): boolean {
    return this._socket?.connected ?? false;
  }

  initialize() {
    this.connect().then();

    return () => {
      this.disconnect();
    };
  }

  private setupSocket() {
    if (this._socket) return this._socket;

    const accessToken = this._tokenProvider.accessToken;

    if (!accessToken) throw new Error("No access token available");

    this._socket = connect(SOCKET_BASE_URL, {
      ...SOCKET_CONFIG,
      query: { access_token: accessToken },
    });

    this.setupEventHandlers();

    return this._socket;
  }

  private setupEventHandlers(): void {
    if (!this._socket) return;

    // Базовая обработка событий
    this._socket.on("connect", this.handleConnect.bind(this));
    this._socket.on("disconnect", this.handleDisconnect.bind(this));
    this._socket.on("connect_error", this.handleConnectError.bind(this));

    // Обработка ошибок аутентификации
    this._socket.on("unauthorized", this.handleUnauthorized.bind(this));
    this._socket.on("token_expired", this.handleTokenExpired.bind(this));
  }

  private async handleConnect(): Promise<void> {
    console.log("Socket connected");
    // Можно добавить синхронизацию состояния
  }

  private handleDisconnect(reason: string): void {
    console.log(`Socket disconnected: ${reason}`);
    if (!this._isManualDisconnect && reason !== "io server disconnect") {
      setTimeout(() => this.reconnect(), 3000);
    }
  }

  private async handleConnectError(err: Error): Promise<void> {
    console.error("Connection error:", err.message);
    await this.handleConnectionFailure();
  }

  private async handleUnauthorized(): Promise<void> {
    console.warn("Unauthorized, attempting to refresh token...");
    await this.handleTokenRefresh();
  }

  private async handleTokenExpired(): Promise<void> {
    console.warn("Token expired, refreshing...");
    await this.handleTokenRefresh();
  }

  private async handleTokenRefresh(): Promise<void> {
    try {
      await this._apiService.updateToken();
      await this.reconnect();
    } catch (refreshError) {
      console.error("Token refresh failed:", refreshError);
      this.disconnect();
    }
  }

  private async handleConnectionFailure(): Promise<void> {
    if (this._socket) {
      this._socket.close();
      this._socket = null;
    }
    await new Promise(resolve => setTimeout(resolve, 5000));
    await this.reconnect();
  }

  connect() {
    return new Promise<Socket | undefined>(resolve => {
      const socket = this.setupSocket();

      if (socket.connected) resolve(socket);

      socket.once("connect", () => resolve(socket));
      socket.once("connect_error", () => resolve(undefined));

      socket.connect();
    });
  }

  async reconnect() {
    this.disconnect();

    return this.connect();
  }

  disconnect(): void {
    this._isManualDisconnect = true;

    // Очистка всех слушателей
    this._listeners.forEach((listener, event) => {
      this._socket?.off(event, listener);
    });
    this._listeners.clear();

    if (this._socket) {
      this._socket.removeAllListeners();
      this._socket.disconnect();
      this._socket = null;
    }
  }

  emit<K extends keyof SocketEmitEvents>(
    event: K,
    ...args: Parameters<SocketEmitEvents[K]>
  ): Promise<Socket> {
    return new Promise((resolve, reject) => {
      const socket = this._socket;

      if (!socket?.connected) {
        return reject(new Error("Socket is not connected"));
      }

      socket.emit(event, ...args, (response: { error?: string }) => {
        if (response?.error) {
          reject(new Error(response.error));
        } else {
          resolve(socket);
        }
      });
    });
  }

  on<K extends keyof SocketEvents>(
    event: K,
    callback: SocketEvents[K],
    unsubscribe?: () => void,
  ): () => void {
    if (!this._socket) {
      throw new Error("Socket is not initialized");
    }

    this._socket.on(event, callback as never);
    this._listeners.set(event, callback);

    return () => {
      this._socket?.off(event, callback as never);
      this._listeners.delete(event);
      unsubscribe?.();
    };
  }
}
