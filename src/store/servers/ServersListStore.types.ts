import { createServiceDecorator } from "@force-dev/utils";

import {
  IWgServerCreateRequestDto,
  WgServerDto,
} from "~@api/api-gen/data-contracts";
import { PagedHolder } from "~@core/holders";
import { ServerModel } from "~@models";

export const IServersListStore = createServiceDecorator<IServersListStore>();

export interface IServersListStore {
  listHolder: PagedHolder<WgServerDto>;
  models: ServerModel[];
  isLoading: boolean;
  total: number;

  load(): Promise<void>;
  createServer(params: IWgServerCreateRequestDto): Promise<any>;
  addServer(server: WgServerDto): void;
  removeServer(id: string): void;
  updateServer(server: WgServerDto): void;
}
