import { DataHolder, iocDecorator, Maybe } from "@force-dev/utils";

import { ServerModel } from "~@models";
import { ICreateServerRequest, IServer, IServerResponse } from "~@service";

export const IServerDataStore = iocDecorator<IServerDataStore>();

export interface IServerDataStore {
  holder: DataHolder<IServer[]>;
  data: IServer[];
  models: ServerModel[];
  loading: boolean;

  createServer(
    data: ICreateServerRequest,
  ): Promise<IServerResponse | undefined>;

  deleteServer(serverId: string): Promise<void>;

  onRefresh(): Promise<Maybe<IServer[]>>;
}
