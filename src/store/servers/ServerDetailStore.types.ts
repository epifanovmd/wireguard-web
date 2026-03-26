import { ApiError } from "@api";
import {
  IWgServerCreateRequestDto,
  IWgServerStatusDto,
  IWgServerUpdateRequestDto,
  WgServerDto,
} from "@api/api-gen/data-contracts";
import { ApiResponse } from "@api/api-gen/http-client";
import { createServiceDecorator } from "@di";
import { ServerModel } from "@models";
import {
  CombinedHolder,
  EntityHolder,
  IHolderError,
  IMutationHolderResult,
  MutationHolder,
  PollingHolder,
} from "@store";

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
  ): Promise<IMutationHolderResult<WgServerDto>>;
  deleteServer(id: string): Promise<IMutationHolderResult<boolean>>;
  startServer(id: string): Promise<IMutationHolderResult<WgServerDto>>;
  stopServer(id: string): Promise<IMutationHolderResult<WgServerDto>>;
  restartServer(id: string): Promise<IMutationHolderResult<WgServerDto>>;
}
