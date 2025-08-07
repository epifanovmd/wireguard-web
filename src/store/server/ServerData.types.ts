import { createServiceDecorator, DataHolder, Maybe } from "@force-dev/utils";

import {
  CreateWgServerPayload,
  IWgServerDto,
} from "~@api/api-gen/data-contracts";
import { ServerModel } from "~@models";

export const IServerDataStore = createServiceDecorator<IServerDataStore>();

export interface IServerDataStore {
  holder: DataHolder<IWgServerDto[]>;
  data: IWgServerDto[];
  models: ServerModel[];
  loading: boolean;
  enabled: boolean;

  createServer(data: CreateWgServerPayload): Promise<IWgServerDto | undefined>;
  deleteServer(serverId: string): Promise<void>;
  getStatus(serverId: string): Promise<void>;
  startServer(serverId: string): Promise<void>;
  stopServer(serverId: string): Promise<void>;
  onRefresh(): Promise<Maybe<IWgServerDto[]>>;
}
