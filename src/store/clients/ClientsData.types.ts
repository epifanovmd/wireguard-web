import { DataHolder, iocDecorator } from "@force-dev/utils";

import { ClientModel } from "~@models";
import { IClient } from "~@service";

export const IClientsDataStore = iocDecorator<IClientsDataStore>();

export interface IClientsDataStore {
  holder: DataHolder<IClient[]>;
  data: IClient[];
  models: ClientModel[];
  loading: boolean;

  start(): void;

  subscribeSocket(): void;
  unSubscribeSocket(): void;

  onRefresh(): Promise<IClient[]>;
}
