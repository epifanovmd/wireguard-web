import { IApiService, ListResponse } from "~@api";

import {
  ICreateServerRequest,
  IServerResponse,
  IServerService,
  TServersResponse,
} from "./Server.types";

@IServerService()
export class ServerService implements IServerService {
  constructor(@IApiService() private _apiService: IApiService) {}

  getServers() {
    return this._apiService.get<ListResponse<TServersResponse>>(
      "/api/wgserver",
    );
  }

  getServer(serverId: string) {
    return this._apiService.get<IServerResponse>("/api/wgserver", {
      serverId,
    });
  }

  createServer(params: ICreateServerRequest) {
    return this._apiService.post<IServerResponse, ICreateServerRequest>(
      "/api/wgserver/create",
      params,
    );
  }

  deleteServer(serverId: string) {
    return this._apiService.delete<string>(`/api/wgserver/delete/${serverId}`);
  }

  getStatus(serverId: string) {
    return this._apiService.get<string>(
      `/api/wgserver/server/${serverId}/status`,
    );
  }

  serverStart(serverId: string) {
    return this._apiService.get<void>(`/api/wgserver/server/${serverId}/start`);
  }

  serverStop(serverId: string) {
    return this._apiService.get<void>(`/api/wgserver/server/${serverId}/stop`);
  }
}
