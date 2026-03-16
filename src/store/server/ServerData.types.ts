import { createServiceDecorator, DataHolder, Maybe } from "@force-dev/utils";

import {
  IWgServerCreateRequestDto,
  WgServerDto,
} from "~@api/api-gen/data-contracts";
import { ServerModel } from "~@models";

// Legacy compat alias
export type CreateWgServerPayload = IWgServerCreateRequestDto;
export type IWgServerDto = WgServerDto;

export const IServerDataStore = createServiceDecorator<IServerDataStore>();

export interface IServerDataStore {
  holder: DataHolder<WgServerDto[]>;
  data: WgServerDto[];
  models: ServerModel[];
  loading: boolean;
  enabled: boolean;

  createServer(data: IWgServerCreateRequestDto): Promise<WgServerDto | undefined>;
  deleteServer(serverId: string): Promise<void>;
  getStatus(serverId: string): Promise<void>;
  startServer(serverId: string): Promise<void>;
  stopServer(serverId: string): Promise<void>;
  onRefresh(): Promise<Maybe<WgServerDto[]>>;
}
