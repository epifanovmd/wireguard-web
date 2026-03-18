import { createServiceDecorator, DataHolder } from "@force-dev/utils";

import {
  IWgServerCreateRequestDto,
  IWgServerStatusDto,
  IWgServerUpdateRequestDto,
  WgServerDto,
} from "~@api/api-gen/data-contracts";
import { ServerModel } from "~@models";

export const IServerDetailStore = createServiceDecorator<IServerDetailStore>();

export interface IServerDetailStore {
  serverHolder: DataHolder<WgServerDto>;
  statusHolder: DataHolder<IWgServerStatusDto>;
  server: WgServerDto | undefined;
  serverModel: ServerModel | undefined;
  liveStatus: IWgServerStatusDto | undefined;

  loadServer(id: string): Promise<WgServerDto | undefined>;
  loadServerStatus(id: string): Promise<IWgServerStatusDto | undefined>;
  createServer(params: IWgServerCreateRequestDto): Promise<any>;
  updateServer(id: string, params: IWgServerUpdateRequestDto): Promise<any>;
  deleteServer(id: string): Promise<any>;
  startServer(id: string): Promise<any>;
  stopServer(id: string): Promise<any>;
  restartServer(id: string): Promise<any>;
}
