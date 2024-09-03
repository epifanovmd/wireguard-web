import { ApiResponse, CancelablePromise, iocDecorator } from "@force-dev/utils";

export interface IClient {
  id: string;
  enabled?: boolean;
  name: string;
  publicKey: string;
  privateKey?: string;
  preSharedKey?: string;
  address: string;
  allowedIPs?: string;
  latestHandshakeAt?: string;
  transferRx?: number;
  transferTx?: number;
  persistentKeepalive?: string;
  createdAt: string;
  updatedAt: string;
}

export type TClientsResponse = IClient[];
export interface IClientResponse extends IClient {}
export interface ICreateClient {
  name: string;
}

export const IClientsService = iocDecorator<IClientsService>();

export interface IClientsService {
  getClients(): CancelablePromise<ApiResponse<TClientsResponse>>;

  getClient(clientId: string): CancelablePromise<ApiResponse<IClientResponse>>;

  getClientConfiguration(
    clientId: string,
  ): CancelablePromise<ApiResponse<string>>;

  getClientQRCode(clientId: string): CancelablePromise<ApiResponse<string>>;
  createClient(
    params: ICreateClient,
  ): CancelablePromise<ApiResponse<IClientResponse>>;

  deleteClient(clientId: string): CancelablePromise<ApiResponse<string>>;
}
