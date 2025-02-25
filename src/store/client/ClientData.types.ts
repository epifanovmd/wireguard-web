import { createServiceDecorator, DataHolder, Maybe } from "@force-dev/utils";

import { ServerModel } from "~@models";
import { IClient } from "~@service";

export const IClientDataStore = createServiceDecorator<IClientDataStore>();

export interface IClientDataStore {
  holder: DataHolder<IClient>;
  data: Maybe<IClient>;
  model: Maybe<ServerModel>;
  loading: boolean;

  subscribeSocket(clientId: string[]): void;

  unsubscribeSocket(): void;

  onRefresh(clientId: string): Promise<Maybe<IClient>>;
}
