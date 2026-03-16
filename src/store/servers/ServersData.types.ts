import { createServiceDecorator, DataHolder } from "@force-dev/utils";

import {
  IWgServerCreateRequestDto,
  IWgServerListDto,
  IWgServerStatusDto,
  IWgServerUpdateRequestDto,
  WgServerDto,
} from "~@api/api-gen/data-contracts";
import { ServerModel } from "~@models";

export const IServersDataStore = createServiceDecorator<IServersDataStore>();

export interface IServersDataStore {
  listHolder: DataHolder<IWgServerListDto>;
  servers: WgServerDto[];
  models: ServerModel[];
  total: number;
  isLoading: boolean;
  server: WgServerDto | undefined;
  serverModel: ServerModel | undefined;
  liveStatus: IWgServerStatusDto | undefined;
  loadServers(): Promise<void>;
  loadServer(id: string): Promise<WgServerDto | undefined>;
  loadServerStatus(id: string): Promise<IWgServerStatusDto | undefined>;
  createServer(params: IWgServerCreateRequestDto): Promise<any>;
  updateServer(id: string, params: IWgServerUpdateRequestDto): Promise<any>;
  deleteServer(id: string): Promise<any>;
  startServer(id: string): Promise<any>;
  stopServer(id: string): Promise<any>;
  restartServer(id: string): Promise<any>;
}
