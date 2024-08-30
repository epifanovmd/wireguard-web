import { ApiResponse, CancelablePromise, iocDecorator } from "@force-dev/utils";

import { IApiService } from "~@api";

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
  getClients(): CancelablePromise<ApiResponse<IClientsResponse>>;
}

@IClientsService()
export class ClientsService implements IClientsService {
  constructor(@IApiService() private _apiService: IApiService) {}

  getClients() {
    return this._apiService.get<IClientsResponse>("/api/wireguard/clients");
  }
}
