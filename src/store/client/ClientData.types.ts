import { createServiceDecorator, DataHolder, Maybe } from "@force-dev/utils";

import { WgPeerDto } from "~@api/api-gen/data-contracts";
import { ClientModel } from "~@models";

export const IClientDataStore = createServiceDecorator<IClientDataStore>();

export interface IClientDataStore {
  holder: DataHolder<WgPeerDto>;
  data: Maybe<WgPeerDto>;
  model: Maybe<ClientModel>;
  loading: boolean;

  onRefresh(clientId: string): Promise<Maybe<WgPeerDto>>;
}
