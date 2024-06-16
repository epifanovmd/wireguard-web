import { ApiResponse, apiService } from "../../api";
import { iocDecorator } from "../../common";

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

export const IClientsService = iocDecorator<IClientsService>();

export interface IClientsService {
  getClients(): Promise<ApiResponse<IClientsResponse>>;
}
