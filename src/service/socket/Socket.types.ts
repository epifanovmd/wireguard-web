import { iocDecorator, SupportInitialize } from "@force-dev/utils";
import { Socket as SocketIO } from "socket.io-client";

import { ClientSocketEmitEvents, ClientsSocketEvents } from "./clients";

export interface SocketEvents extends ClientsSocketEvents {}

export interface SocketEmitEvents extends ClientSocketEmitEvents {}

export type Socket = SocketIO<SocketEvents, SocketEmitEvents>;

export const ISocketService = iocDecorator<ISocketService>();

export interface ISocketService extends SupportInitialize {
  get socket(): Socket;

  initialize(): () => void;

  emit<K extends keyof SocketEmitEvents>(
    event: K,
    ...args: Parameters<SocketEmitEvents[K]>
  ): Socket;

  on<K extends keyof SocketEvents>(
    event: K,
    onEvent: SocketEvents[K],
    unsubscribe?: () => void,
  ): () => void;

  connect(): Socket | undefined;

  disconnect(): void;
}
