import { IClient } from "../../clients";
import { ISocketService } from "../Socket.types";
import { IClientsSocketService } from "./ClientsSocket.types";

@IClientsSocketService()
export class ClientsSocketService implements IClientsSocketService {
  constructor(@ISocketService() private _socketService: ISocketService) {}

  subscribeAllClients = (onData?: (clients: IClient[]) => void) => {
    this._socketService.emit("subscribeToAll");

    this._socketService.on("all", clients => {
      onData?.(clients);
    });
  };

  unsubscribeAllClients = () => {
    this._socketService.emit("unsubscribeFromAll");
  };

  subscribeClient = (clientId: string, onData?: (client: IClient) => void) => {
    this._socketService.emit("subscribeToClient", clientId);

    this._socketService.on("client", client => {
      onData?.(client);
    });
  };

  unsubscribeClient = (clientId: string) => {
    this._socketService.emit("unsubscribeFromClient", clientId);
  };
}
