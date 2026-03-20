import { createServiceDecorator } from "@force-dev/utils";

import {
  IWgServerCreateRequestDto,
  WgServerDto,
} from "~@api/api-gen/data-contracts";
import {
  IHolderError,
  IMutationHolderResult,
  MutationHolder,
  PagedHolder,
} from "~@core/holders";
import { ServerModel } from "~@models";

export const IServersListStore = createServiceDecorator<IServersListStore>();

export interface IServersListStore {
  listHolder: PagedHolder<WgServerDto>;
  createServerMutation: MutationHolder<IWgServerCreateRequestDto, WgServerDto>;
  models: ServerModel[];
  isLoading: boolean;
  total: number;

  load(): Promise<void>;
  createServer(
    params: IWgServerCreateRequestDto,
  ): Promise<IMutationHolderResult<WgServerDto>>;
  deleteServer(id: string): Promise<IMutationHolderResult<boolean>>;
  addServer(server: WgServerDto): void;
  removeServer(id: string): void;
  updateServer(server: WgServerDto): void;
}
