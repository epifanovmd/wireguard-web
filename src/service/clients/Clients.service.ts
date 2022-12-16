import { injectable } from "inversify";

import { apiService } from "../../api";
import { IClientsResponse } from "./Clients.types";

@injectable()
export class ClientsService {
  getClients() {
    return apiService.get<IClientsResponse>("/api/wireguard/clients");
  }
}
