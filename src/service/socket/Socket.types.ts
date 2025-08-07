import { createServiceDecorator, SupportInitialize } from "@force-dev/utils";
import { Socket as SocketIO } from "socket.io-client";

import { CallSocketEmitEvents, CallSocketEvents } from "./call";
import { ClientSocketEmitEvents, ClientsSocketEvents } from "./clients";

export interface SocketEvents extends CallSocketEvents, ClientsSocketEvents {}

export interface SocketEmitEvents
  extends CallSocketEmitEvents,
    ClientSocketEmitEvents {}

export type Socket = SocketIO<SocketEvents, SocketEmitEvents>;

export const ISocketService = createServiceDecorator<ISocketService>();

export interface ISocketService extends SupportInitialize {
  isConnected: boolean;

  initialize(): () => void;

  emit<K extends keyof SocketEmitEvents>(
    event: K,
    ...args: Parameters<SocketEmitEvents[K]>
  ): Promise<Socket>;

  on<K extends keyof SocketEvents>(
    event: K,
    onEvent: SocketEvents[K],
    unsubscribe?: () => void,
  ): () => void;

  connect(): Promise<Socket | undefined>;

  disconnect(): void;
}
