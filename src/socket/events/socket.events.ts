import { WgSocketClientEvents, WgSocketServerEvents } from "./wg.events";

/** All events the server emits → client listens */
export interface SocketServerToClientEvents extends WgSocketServerEvents {}

/** All events the client emits → server listens */
export interface SocketClientToServerEvents extends WgSocketClientEvents {}
