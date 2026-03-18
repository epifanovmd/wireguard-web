import { createServiceDecorator, ListCollectionHolder } from "@force-dev/utils";

import {
  IWgPeerCreateRequestDto,
  WgPeerDto,
} from "~@api/api-gen/data-contracts";
import { PeerModel } from "~@models";

export type PeerListArgs = {
  serverId?: string;
  userId?: string;
  my?: boolean;
};

export const IPeersListStore = createServiceDecorator<IPeersListStore>();

export interface IPeersListStore {
  listHolder: ListCollectionHolder<WgPeerDto, PeerListArgs>;
  models: PeerModel[];
  isLoading: boolean;
  total: number;

  loadByServer(serverId: string): Promise<void>;
  loadByUser(userId: string): Promise<void>;
  loadMine(): Promise<void>;

  createPeer(
    serverId: string,
    params: IWgPeerCreateRequestDto,
  ): Promise<{ data?: WgPeerDto; error?: any }>;
  addPeer(peer: WgPeerDto): void;
  removePeer(id: string): void;
  updatePeer(peer: WgPeerDto): void;
}
