import { DataHolder, iocDecorator } from "@force-dev/utils";

import { ClientModel } from "~@models";
import { IClient, ICreateClient } from "~@service";

export const IClientsDataStore = iocDecorator<IClientsDataStore>();

export interface IClientsDataStore {
  holder: DataHolder<IClient[]>;
  data: IClient[];
  models: ClientModel[];
  loading: boolean;

  start(): void;

  subscribeSocket(): void;

  unSubscribeSocket(): void;

  createClient(params: ICreateClient): Promise<void>;

  deleteClient(clientId: string): Promise<void>;

  onRefresh(): Promise<IClient[]>;
}
