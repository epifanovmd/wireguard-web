import { inject, injectable } from "inversify";
import { connect } from "socket.io-client";

import { SOCKET_BASE_URL } from "../../api";
import { SupportInitialize } from "../../common";
import { AuthService } from "../auth";
import { Socket, SocketEmitEvents, SocketEvents } from "./Socket.types";

@injectable()
export class SocketService implements SupportInitialize {
  private _socket: Socket | undefined;

  constructor(@inject(AuthService) private _authService: AuthService) {}

  get socket() {
    if (this._socket) {
      return this._socket;
    }

    return this.connect();
  }

  initialize() {
    this.connect();

    return () => {
      this.disconnect();
    };
  }

  emit = <K extends keyof SocketEmitEvents>(
    event: K,
    ...args: Parameters<SocketEmitEvents[K]>
  ) => {
    return this.socket.emit(event, ...args);
  };

  on = <K extends keyof SocketEvents>(
    event: K,
    onEvent: SocketEvents[K],
    unsubscribe?: () => void,
  ) => {
    const self = this.socket.on(event, onEvent as any);

    return () => {
      self.removeListener(event, onEvent as any);
      unsubscribe?.();
    };
  };

  connect() {
    if (this._socket) {
      return this._socket.connect();
    } else {
      this._socket = connect(SOCKET_BASE_URL, {
        withCredentials: true,
        query: { access_token: this._authService.getLocalAccessToken() },
        autoConnect: true,
        reconnection: true,
      });

      this._socket.on("connect", () => {
        console.log("Socket connected");
      });

      this._socket.on("disconnect", () => {
        console.log("Socket disconnected");
      });

      this._socket.on("connect_error", err => {
        console.log("SOCKET_BASE_URL", SOCKET_BASE_URL);
        console.log("Error connect", err);
      });

      return this._socket;
    }
  }

  disconnect = () => {
    console.log("disconnect _socket", this._socket);
    this._socket?.disconnect();
  };
}
