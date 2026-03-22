import { reaction } from "mobx";
import { connect } from "socket.io-client";

import { IAuthSessionService, IAuthTokenStore } from "~@core/auth";
import { SOCKET_BASE_URL } from "~@core/env";

import {
  SocketClientToServerEvents,
  SocketServerToClientEvents,
} from "../events";
import {
  AppSocket,
  ISocketTransport,
  SocketStatusListener,
  SocketTransportState,
} from "./socketTransport.types";

@ISocketTransport({ inSingleton: true })
export class SocketTransport implements ISocketTransport {
  private _socket: AppSocket | null = null;
  private _isManualDisconnect = false;
  private _statusListeners = new Set<SocketStatusListener>();

  // Pending emits while socket is not yet connected
  private _emitQueue: Array<() => void> = [];

  private _state: SocketTransportState = {
    status: "idle",
    error: null,
  };

  constructor(
    @IAuthTokenStore() private _tokenStore: IAuthTokenStore,
    @IAuthSessionService() private _session: IAuthSessionService,
  ) {}

  get state(): SocketTransportState {
    return this._state;
  }

  // ─── Lifecycle ──────────────────────────────────────────────────────────────

  initialize(): () => void {
    const disposeTokenReaction = reaction(
      () => this._tokenStore.accessToken,
      token => {
        if (this._socket && token) {
          this._socket.auth = { token };
        }
      },
    );

    const handleVisibilityChange = () => {
      if (
        document.visibilityState === "visible" &&
        !this._isManualDisconnect &&
        !this._socket?.connected
      ) {
        this.connect().catch(() => {});
      }
    };

    const handleOnline = () => {
      if (!this._isManualDisconnect && !this._socket?.connected) {
        this.connect().catch(() => {});
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("online", handleOnline);

    this.connect().catch(() => {});

    return () => {
      disposeTokenReaction();
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("online", handleOnline);
      this.disconnect();
    };
  }

  connect(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      if (this._socket?.connected) {
        resolve();
        return;
      }

      this._teardown();

      const accessToken = this._tokenStore.accessToken;

      if (!accessToken) {
        const err = new Error("[Socket] No access token available");
        this._setState({ status: "error", error: err });
        reject(err);
        return;
      }

      this._isManualDisconnect = false;
      this._setState({ status: "connecting", error: null });

      const socket: AppSocket = connect(SOCKET_BASE_URL, {
        withCredentials: true,
        autoConnect: false,
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 3000,
        transports: ["websocket"],
        timeout: 10_000,
        auth: { token: accessToken },
        query: { access_token: accessToken },
      });

      this._socket = socket;

      // One-time connect/error for the Promise
      const onFirstConnect = () => {
        socket.off("connect_error", onFirstError);
        resolve();
      };
      const onFirstError = (err: Error) => {
        socket.off("connect", onFirstConnect);
        this._setState({ status: "error", error: err });
        reject(err);
      };
      socket.once("connect", onFirstConnect);
      socket.once("connect_error", onFirstError);

      // Persistent lifecycle handlers
      socket.on("connect", this._onConnect);
      socket.on("connect_error", this._onConnectError);
      socket.on("disconnect", this._onDisconnect);
      socket.on("auth_error", this._onAuthError);

      socket.connect();
    });
  }

  disconnect(): void {
    this._isManualDisconnect = true;
    this._emitQueue = [];
    this._teardown();
    this._setState({ status: "disconnected", error: null });
  }

  // ─── Pub/Sub ────────────────────────────────────────────────────────────────

  on<K extends keyof SocketServerToClientEvents>(
    event: K,
    handler: SocketServerToClientEvents[K],
  ): () => void {
    if (!this._socket) {
      console.warn(`[Socket] on("${String(event)}") called before connect()`);
      return () => {};
    }
    this._socket.on(event, handler as never);
    return () => this._socket?.off(event, handler as never);
  }

  emit<K extends keyof SocketClientToServerEvents>(
    event: K,
    ...args: Parameters<SocketClientToServerEvents[K]>
  ): void {
    const doEmit = (s: AppSocket) =>
      (
        s.emit as (
          e: K,
          ...a: Parameters<SocketClientToServerEvents[K]>
        ) => void
      )(event, ...args);

    if (this._socket?.connected) {
      doEmit(this._socket);
    } else if (this._socket) {
      const socket = this._socket;
      const queued = () => doEmit(socket);
      this._emitQueue.push(queued);
    }
  }

  onConnect(handler: () => void): () => void {
    if (!this._socket) return () => {};
    this._socket.on("connect", handler);
    return () => this._socket?.off("connect", handler);
  }

  onDisconnect(handler: (reason: string) => void): () => void {
    if (!this._socket) return () => {};
    this._socket.on("disconnect", handler as never);
    return () => this._socket?.off("disconnect", handler as never);
  }

  onStatusChange(listener: SocketStatusListener): () => void {
    this._statusListeners.add(listener);
    return () => this._statusListeners.delete(listener);
  }

  // ─── Private ────────────────────────────────────────────────────────────────

  private _teardown(): void {
    if (this._socket) {
      this._socket.removeAllListeners();
      this._socket.disconnect();
      this._socket = null;
    }
  }

  private _setState(partial: Partial<SocketTransportState>): void {
    this._state = { ...this._state, ...partial };
    this._statusListeners.forEach(l => l(this._state));
  }

  private _flushEmitQueue(): void {
    const queue = this._emitQueue.splice(0);

    queue.forEach(fn => fn());
  }

  private _onConnect = (): void => {
    this._setState({ status: "connected", error: null });
    this._flushEmitQueue();
  };

  private _onDisconnect = (reason: string): void => {
    if (this._isManualDisconnect) return;

    this._setState({ status: "disconnected" });

    // Server-side kick → refresh token and reconnect
    if (reason === "io server disconnect") {
      this._session
        .refreshToken()
        .then(() => this.connect())
        .catch(err => this._setState({ status: "error", error: err }));
    }
    // Other reasons handled by socket.io's built-in reconnection
  };

  private _onConnectError = (err: Error): void => {
    console.error("[Socket] Connection error:", err.message);
    this._setState({ status: "error", error: err });
  };

  private _onAuthError = ({ message }: { message: string }): void => {
    console.warn("[Socket] Auth error:", message);
    this._session
      .restoreSession()
      .then(() => this.connect())
      .catch(err => this._setState({ status: "error", error: err }));
  };
}
