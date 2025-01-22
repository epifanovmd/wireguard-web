import { ISocketService } from "../Socket.types";
import { ICallSocketService } from "./CallSocket.types";

@ICallSocketService()
export class CallSocketService implements ICallSocketService {
  constructor(@ISocketService() public socket: ISocketService) {}
}
