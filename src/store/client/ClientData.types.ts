import { WgPeerDto } from "@api/api-gen/data-contracts";
import { createServiceDecorator } from "@di";
import { ClientModel } from "@models";
import { EntityHolder } from "@store";

export const IClientDataStore = createServiceDecorator<IClientDataStore>();

export interface IClientDataStore {
  holder: EntityHolder<WgPeerDto, string>;
  data: WgPeerDto | undefined;
  model: ClientModel | undefined;
  loading: boolean;

  onRefresh(clientId: string): Promise<WgPeerDto | undefined>;
}
