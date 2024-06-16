import { apiService } from "../../api";
import { IClientsResponse, IClientsService } from "./Clients.types";

@IClientsService()
export class ClientsService implements IClientsService {
  getClients() {
    return apiService.get<IClientsResponse>("/api/wireguard/clients");
  }
}
