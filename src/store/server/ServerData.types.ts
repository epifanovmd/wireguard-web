import { createServiceDecorator, DataHolder, Maybe } from "@force-dev/utils";

import { ServerModel } from "~@models";
import { ICreateServerRequest, IServer, IServerResponse } from "~@service";

export const IServerDataStore = createServiceDecorator<IServerDataStore>();

export interface IServerDataStore {
  holder: DataHolder<IServer[]>;
  data: IServer[];
  models: ServerModel[];
  loading: boolean;
  enabled: boolean;

  createServer(
    data: ICreateServerRequest,
  ): Promise<IServerResponse | undefined>;

  deleteServer(serverId: string): Promise<void>;

  getStatus(serverId: string): Promise<void>;

  startServer(serverId: string): Promise<void>;

  stopServer(serverId: string): Promise<void>;

  onRefresh(): Promise<Maybe<IServer[]>>;
}
