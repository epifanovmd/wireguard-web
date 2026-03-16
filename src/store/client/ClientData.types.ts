import { createServiceDecorator, DataHolder, Maybe } from "@force-dev/utils";

import { ClientModel, IWgClientsDto } from "~@models";

export const IClientDataStore = createServiceDecorator<IClientDataStore>();

export interface IClientDataStore {
  holder: DataHolder<IWgClientsDto>;
  data: Maybe<IWgClientsDto>;
  model: Maybe<ClientModel>;
  loading: boolean;

  onRefresh(clientId: string): Promise<Maybe<IWgClientsDto>>;
}
