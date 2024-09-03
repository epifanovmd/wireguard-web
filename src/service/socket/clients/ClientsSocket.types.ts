import { iocDecorator } from "@force-dev/utils";

import { IClient } from "../../client";

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

export const IClientsSocketService = iocDecorator<IClientsSocketService>();

export interface IClientsSocketService {
  subscribeAllClients(onData?: (clients: IClient[]) => void): void;

  unsubscribeAllClients(): void;

  subscribeClient(clientId: string, onData?: (client: IClient) => void): void;

  unsubscribeClient(clientId: string): void;
}
