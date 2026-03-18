import { createServiceDecorator, ListCollectionHolder } from "@force-dev/utils";

import {
  IWgServerCreateRequestDto,
  WgServerDto,
} from "~@api/api-gen/data-contracts";
import { ServerModel } from "~@models";

export const IServersListStore = createServiceDecorator<IServersListStore>();

export interface IServersListStore {
  listHolder: ListCollectionHolder<WgServerDto>;
  models: ServerModel[];
  isLoading: boolean;
  total: number;

  load(): Promise<void>;
  createServer(params: IWgServerCreateRequestDto): Promise<any>;
  addServer(server: WgServerDto): void;
  removeServer(id: string): void;
  updateServer(server: WgServerDto): void;
}
