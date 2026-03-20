import { createServiceDecorator } from "@force-dev/utils";

import { WgPeerDto } from "~@api/api-gen/data-contracts";
import { EntityHolder } from "~@core/holders";
import { ClientModel } from "~@models";

export const IClientDataStore = createServiceDecorator<IClientDataStore>();

export interface IClientDataStore {
  holder: EntityHolder<WgPeerDto, string>;
  data: WgPeerDto | undefined;
  model: ClientModel | undefined;
  loading: boolean;

  onRefresh(clientId: string): Promise<WgPeerDto | undefined>;
}
