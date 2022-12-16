import { IClient } from "../../clients";

export interface ClientsSocketEvents {
  all: (...args: [data: IClient[]]) => void;
  client: (...args: [data: IClient]) => void;
}

export interface ClientSocketEmitEvents {
  subscribeToAll: () => void;
  unsubscribeFromAll: () => void;
  subscribeToClient: (...args: [clientId: string]) => void;
  unsubscribeFromClient: (...args: [clientId: string]) => void;
}
