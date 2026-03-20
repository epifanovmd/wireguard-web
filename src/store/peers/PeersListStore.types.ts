import { createServiceDecorator } from "@force-dev/utils";

import {
  IWgPeerCreateRequestDto,
  WgPeerDto,
} from "~@api/api-gen/data-contracts";
import {
  IHolderError,
  IMutationHolderResult,
  MutationHolder,
  PagedHolder,
} from "~@core/holders";
import { PeerModel } from "~@models";

export type PeerListArgs = {
  serverId?: string;
  userId?: string;
};

export const IPeersListStore = createServiceDecorator<IPeersListStore>();

export interface IPeersListStore {
  peersHolder: PagedHolder<WgPeerDto, PeerListArgs>;
  createPeerMutation: MutationHolder<
    { serverId: string; params: IWgPeerCreateRequestDto },
    WgPeerDto
  >;
  models: PeerModel[];
  isLoading: boolean;
  total: number;
  pageCount: number;

  loadByServer(serverId: string): Promise<void>;
  loadByUser(userId: string): Promise<void>;
  loadMine(): Promise<void>;
  goToPage(page: number): Promise<void>;
  setPageSize(pageSize: number): Promise<void>;

  createPeer(
    serverId: string,
    params: IWgPeerCreateRequestDto,
  ): Promise<IMutationHolderResult<WgPeerDto>>;
  addPeer(peer: WgPeerDto): void;
  removePeer(id: string): void;
  updatePeer(peer: WgPeerDto): void;
}
