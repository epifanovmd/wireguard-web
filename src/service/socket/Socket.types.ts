import { Socket as SocketIO } from "socket.io-client";

import {
  ClientSocketEmitEvents,
  ClientsSocketEvents,
} from "./clients/ClientsSocket.types";

export interface SocketEvents extends ClientsSocketEvents {}

export interface SocketEmitEvents extends ClientSocketEmitEvents {}

export type Socket = SocketIO<SocketEvents, SocketEmitEvents>;
