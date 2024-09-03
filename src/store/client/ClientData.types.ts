import { DataHolder, iocDecorator, Maybe } from "@force-dev/utils";

import { ClientModel } from "~@models";
import { IClient } from "~@service";

export const IClientDataStore = iocDecorator<IClientDataStore>();

export interface IClientDataStore {
  holder: DataHolder<IClient>;
  data: Maybe<IClient>;
  model: Maybe<ClientModel>;
  loading: boolean;

  onRefresh(clientId: string): Promise<Maybe<IClient>>;
}
