import { createServiceDecorator, SupportInitialize } from "@di";
import { Socket as SocketIO } from "socket.io-client";

import {
  SocketClientToServerEvents,
  SocketServerToClientEvents,
} from "../events";

export type AppSocket = SocketIO<
  SocketServerToClientEvents,
  SocketClientToServerEvents
>;

export type SocketConnectionStatus =
  | "idle"
  | "connecting"
  | "connected"
  | "disconnected"
  | "error";

export interface SocketTransportState {
  status: SocketConnectionStatus;
  error: Error | null;
}

export type SocketStatusListener = (state: SocketTransportState) => void;

export const ISocketTransport = createServiceDecorator<ISocketTransport>();

export interface ISocketTransport extends SupportInitialize {
  readonly state: SocketTransportState;

  initialize(): () => void;
  connect(): Promise<void>;
  disconnect(): void;

  on<K extends keyof SocketServerToClientEvents>(
    event: K,
    handler: SocketServerToClientEvents[K],
  ): () => void;

  emit<K extends keyof SocketClientToServerEvents>(
    event: K,
    ...args: Parameters<SocketClientToServerEvents[K]>
  ): void;

  onConnect(handler: () => void): () => void;
  onDisconnect(handler: (reason: string) => void): () => void;
  onStatusChange(listener: SocketStatusListener): () => void;
}
