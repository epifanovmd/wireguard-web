import { DataHolder, iocDecorator } from "@force-dev/utils";

import { ClientModel } from "~@models";
import { IClient, ICreateClientRequest, IUpdateClientRequest } from "~@service";

export const IClientsDataStore = iocDecorator<IClientsDataStore>();

export interface IClientsDataStore {
  holder: DataHolder<IClient[]>;
  data: IClient[];
  models: ClientModel[];
  loading: boolean;

  start(): void;

  subscribeSocket(clientId: string[]): void;

  unsubscribeSocket(): void;

  updateClient(clientId: string, params: IUpdateClientRequest): Promise<void>;

  createClient(params: ICreateClientRequest): Promise<void>;

  deleteClient(clientId: string): Promise<void>;

  onRefresh(serverId: string): Promise<IClient[]>;
}
