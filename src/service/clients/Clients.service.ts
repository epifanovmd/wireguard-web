import { IApiService } from "../../api";
import { IClientsResponse, IClientsService } from "./Clients.types";

@IClientsService()
export class ClientsService implements IClientsService {
  constructor(@IApiService() private _apiService: IApiService) {}

  getClients() {
    return this._apiService.get<IClientsResponse>("/api/wireguard/clients");
  }
}
