import { iocDecorator } from "@force-dev/utils";

export interface IWireguardPeerStatus {
  allowedIps: string;
  latestHandshakeAt?: string;
  transferRx: number;
  transferTx: number;
  persistentKeepalive: number;
}

export interface IWireguardPeerStatusDto
  extends Record<string, IWireguardPeerStatus | null> {}

export interface ClientsSocketEvents {
  client: (...args: [clients: IWireguardPeerStatusDto]) => void;
}

export interface ClientSocketEmitEvents {
  subscribeToClient: (...args: [clientId: string[]]) => void;
  unsubscribeFromClient: () => void;
}

export const IClientsSocketService = iocDecorator<IClientsSocketService>();

export interface IClientsSocketService {
  subscribeClient(
    clientId: string[],
    onData?: (data: IWireguardPeerStatusDto) => void,
  ): void;

  unsubscribeClient(): void;
}
