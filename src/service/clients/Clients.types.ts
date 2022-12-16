export interface IClient {
  id: string;
  enabled?: boolean;
  name: string;
  publicKey: string;
  privateKey?: string;
  preSharedKey?: string;
  address: string;
  allowedIPs?: string;
  latestHandshakeAt: Date;
  transferRx?: number;
  transferTx?: number;
  persistentKeepalive?: string;
  createdAt: Date;
  updatedAt: Date;
}

export type IClientsResponse = IClient[];
