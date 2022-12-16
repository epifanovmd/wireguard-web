import { inject, injectable } from "inversify";

import { IClient } from "../../clients";
import { SocketService } from "../Socket.service";

@injectable()
export class ClientsSocketService {
  constructor(@inject(SocketService) private _socketService: SocketService) {}

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
