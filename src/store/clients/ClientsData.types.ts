import { createServiceDecorator, DataHolder } from "@force-dev/utils";

import {
  IWgClientCreateRequest,
  IWgClientsDto,
  IWgClientUpdateRequest,
} from "~@api/api-gen/data-contracts";
import { ClientModel } from "~@models";

export const IClientsDataStore = createServiceDecorator<IClientsDataStore>();

export interface IClientsDataStore {
  holder: DataHolder<IWgClientsDto[]>;
  data: IWgClientsDto[];
  models: ClientModel[];
  loading: boolean;

  start(): void;
  subscribeSocket(clientId: string[]): void;
  unsubscribeSocket(): void;
  updateClient(clientId: string, params: IWgClientUpdateRequest): Promise<void>;
  createClient(params: IWgClientCreateRequest): Promise<void>;
  deleteClient(clientId: string): Promise<void>;
  onRefresh(serverId: string): Promise<IWgClientsDto[]>;
}
