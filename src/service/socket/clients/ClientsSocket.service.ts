import { ISocketService } from "../Socket.types";
import {
  IClientsSocketService,
  IWireguardPeerStatusDto,
} from "./ClientsSocket.types";

@IClientsSocketService()
export class ClientsSocketService implements IClientsSocketService {
  constructor(@ISocketService() private _socketService: ISocketService) {}

  subscribeClient = (
    clientId: string[],
    onData?: (client: IWireguardPeerStatusDto) => void,
  ) => {
    this._socketService.emit("subscribeToClient", clientId);

    this._socketService.on("client", clients => {
      onData?.(clients);
    });
  };

  unsubscribeClient = () => {
    this._socketService.emit("unsubscribeFromClient");
  };
}
