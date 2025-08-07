import { createServiceDecorator, DataHolder, Maybe } from "@force-dev/utils";

import { IWgClientsDto } from "~@api/api-gen/data-contracts";
import { ServerModel } from "~@models";

export const IClientDataStore = createServiceDecorator<IClientDataStore>();

export interface IClientDataStore {
  holder: DataHolder<IWgClientsDto>;
  data: Maybe<IWgClientsDto>;
  model: Maybe<ServerModel>;
  loading: boolean;

  subscribeSocket(clientId: string[]): void;
  unsubscribeSocket(): void;
  onRefresh(clientId: string): Promise<Maybe<IWgClientsDto>>;
}
