import { createServiceDecorator } from "@force-dev/utils";

export interface IWireguardPeerStatus {
  allowedIps: string;
  latestHandshakeAt?: string;
  transferRx: number;
  transferTx: number;
  persistentKeepalive: number;
}

export type IWireguardPeerStatusDto = Record<
  string,
  IWireguardPeerStatus | null
>;

export interface ClientsSocketEvents {
  client: (...args: [clients: IWireguardPeerStatusDto]) => void;
}

export interface ClientSocketEmitEvents {
  subscribeToClient: (...args: [clientId: string[]]) => void;
  unsubscribeFromClient: () => void;
}

export const IClientsSocketService =
  createServiceDecorator<IClientsSocketService>();

export interface IClientsSocketService {
  subscribeClient(
    clientId: string[],
    onData?: (data: IWireguardPeerStatusDto) => void,
  ): void;

  unsubscribeClient(): void;
}
