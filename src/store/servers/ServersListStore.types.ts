import {
  IWgServerCreateRequestDto,
  WgServerDto,
} from "@api/api-gen/data-contracts";
import { createServiceDecorator } from "@di";
import { ServerModel } from "@models";
import {
  IHolderError,
  IMutationHolderResult,
  MutationHolder,
  PagedHolder,
} from "@store";

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
