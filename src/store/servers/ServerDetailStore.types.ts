import { ApiResponse, createServiceDecorator } from "@force-dev/utils";

import { ApiError } from "~@api";
import {
  IWgServerCreateRequestDto,
  IWgServerStatusDto,
  IWgServerUpdateRequestDto,
  WgServerDto,
} from "~@api/api-gen/data-contracts";
import {
  CombinedHolder,
  EntityHolder,
  IHolderError,
  IMutationHolderResult,
  MutationHolder,
  PollingHolder,
} from "~@core/holders";
import { ServerModel } from "~@models";

export const IServerDetailStore = createServiceDecorator<IServerDetailStore>();

export interface IServerDetailStore {
  serverHolder: EntityHolder<WgServerDto, string>;
  statusHolder: PollingHolder<IWgServerStatusDto, string>;
  pageHolder: CombinedHolder;
  serverActionMutation: MutationHolder<string, WgServerDto>;
  updateServerMutation: MutationHolder<
    { id: string; params: IWgServerUpdateRequestDto },
    WgServerDto
  >;
  server: WgServerDto | null;
  serverModel: ServerModel | null;
  liveStatus: IWgServerStatusDto | null;

  loadServer(id: string): Promise<WgServerDto | null>;
  loadServerStatus(id: string): Promise<IWgServerStatusDto | null>;
  startStatusPolling(id: string): void;
  stopStatusPolling(): void;
  createServer(params: IWgServerCreateRequestDto): Promise<void>;
  updateServer(
    id: string,
    params: IWgServerUpdateRequestDto,
  ): Promise<IMutationHolderResult<WgServerDto, IHolderError>>;
  deleteServer(id: string): Promise<ApiResponse<boolean, ApiError>>;
  startServer(id: string): Promise<IMutationHolderResult<WgServerDto, IHolderError>>;
  stopServer(id: string): Promise<IMutationHolderResult<WgServerDto, IHolderError>>;
  restartServer(id: string): Promise<IMutationHolderResult<WgServerDto, IHolderError>>;
}
