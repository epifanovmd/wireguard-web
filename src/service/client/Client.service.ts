import { IApiService, ListResponse } from "~@api";

import {
  IClientResponse,
  IClientsService,
  ICreateClientRequest,
  IUpdateClientRequest,
  TClientsResponse,
} from "./Client.types";

@IClientsService()
export class ClientService implements IClientsService {
  constructor(@IApiService() private _apiService: IApiService) {}

  getClients(serverId: string) {
    return this._apiService.get<ListResponse<TClientsResponse>, string>(
      `/api/wgclients/server/${serverId}`,
    );
  }

  getClient(clientId: string) {
    return this._apiService.get<IClientResponse>(
      `/api/wgclients/client/${clientId}`,
    );
  }

  getClientConfiguration(clientId: string) {
    return this._apiService.get<string>(
      `/api/wgclients/client/${clientId}/configuration`,
    );
  }

  createClient(params: ICreateClientRequest) {
    return this._apiService.post<IClientResponse, ICreateClientRequest>(
      "/api/wgclients/create",
      params,
    );
  }

  updateClient(clientId: string, params: IUpdateClientRequest) {
    return this._apiService.patch<IClientResponse, IUpdateClientRequest>(
      `/api/wgclients/update/${clientId}`,
      params,
    );
  }

  deleteClient(clientId: string) {
    return this._apiService.delete<string>(`/api/wgclients/delete/${clientId}`);
  }
}
