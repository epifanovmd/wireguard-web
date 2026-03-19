import { ApiResponse, createServiceDecorator } from "@force-dev/utils";

import { ApiError } from "~@api";
import {
  IWgServerCreateRequestDto,
  IWgServerStatusDto,
  IWgServerUpdateRequestDto,
  WgServerDto,
} from "~@api/api-gen/data-contracts";
import { ServerModel } from "~@models";

import { EntityHolder } from "../holders";

export const IServerDetailStore = createServiceDecorator<IServerDetailStore>();

export interface IServerDetailStore {
  serverHolder: EntityHolder<WgServerDto, string>;
  statusHolder: EntityHolder<IWgServerStatusDto, string>;
  server: WgServerDto | null;
  serverModel: ServerModel | null;
  liveStatus: IWgServerStatusDto | null;

  loadServer(id: string): Promise<WgServerDto | null>;
  loadServerStatus(id: string): Promise<IWgServerStatusDto | null>;
  createServer(params: IWgServerCreateRequestDto): Promise<void>;
  updateServer(
    id: string,
    params: IWgServerUpdateRequestDto,
  ): Promise<ApiResponse<WgServerDto, ApiError>>;
  deleteServer(id: string): Promise<ApiResponse<boolean, ApiError>>;
  startServer(id: string): Promise<ApiResponse<WgServerDto, ApiError>>;
  stopServer(id: string): Promise<ApiResponse<WgServerDto, ApiError>>;
  restartServer(id: string): Promise<ApiResponse<WgServerDto, ApiError>>;
}
