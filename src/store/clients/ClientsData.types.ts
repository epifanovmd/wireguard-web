import { CollectionHolder, iocDecorator } from "@force-dev/utils";

import { ClientModel } from "../../models";
import { IClient } from "../../service";

export const IClientsDataStore = iocDecorator<IClientsDataStore>();

export interface IClientsDataStore {
  holder: CollectionHolder<IClient>;
  data: IClient[];
  models: ClientModel[];

  start(): void;

  subscribeSocket(): void;
  unSubscribeSocket(): void;

  onRefresh(): Promise<IClient[]>;
}
