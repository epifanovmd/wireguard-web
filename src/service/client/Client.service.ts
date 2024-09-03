import { IApiService } from "~@api";

import {
  IClientResponse,
  IClientsService,
  ICreateClient,
  TClientsResponse,
} from "./Client.types";

@IClientsService()
export class ClientService implements IClientsService {
  constructor(@IApiService() private _apiService: IApiService) {}

  getClients() {
    return this._apiService.get<TClientsResponse>("/api/wireguard/clients");
  }

  getClient(clientId: string) {
    return this._apiService.get<IClientResponse>("/api/wireguard/client", {
      clientId,
    });
  }

  getClientQRCode(clientId: string) {
    return this._apiService.get<string>("/api/wireguard/client/qrcode", {
      clientId,
    });
  }

  getClientConfiguration(clientId: string) {
    return this._apiService.get<string>("/api/wireguard/client/configuration", {
      clientId,
    });
  }

  createClient(params: ICreateClient) {
    return this._apiService.post<IClientResponse, ICreateClient>(
      "/api/wireguard/client",
      params,
    );
  }

  deleteClient(clientId: string) {
    return this._apiService.delete<string>(`/api/wireguard/client/${clientId}`);
  }
}
