import { IApiService } from "@api";
import {
  IWgPeerCreateRequestDto,
  WgPeerDto,
} from "@api/api-gen/data-contracts";
import { PeerModel } from "@models";
import { MutationHolder, PagedHolder } from "@store";
import { makeAutoObservable } from "mobx";

import { IPeersListStore, PeerListArgs } from "./PeersListStore.types";

@IPeersListStore({ inSingleton: true })
export class PeersListStore implements IPeersListStore {
  public createPeerMutation = new MutationHolder<
    { serverId: string; params: IWgPeerCreateRequestDto },
    WgPeerDto
  >();
  public peersHolder = new PagedHolder<WgPeerDto, PeerListArgs>({
    pageSize: 1000,
    keyExtractor: p => p.id,
    onFetch: async ({ offset, limit }, { serverId, userId } = {}) => {
      return this._apiService.getPeers({ serverId, userId, offset, limit });
    },
  });

  constructor(@IApiService() private _apiService: IApiService) {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  get models() {
    return this.peersHolder.items.map(p => new PeerModel(p));
  }

  get isLoading() {
    return this.peersHolder.isLoading;
  }

  get total() {
    return this.peersHolder.pagination.totalCount;
  }

  get pageCount() {
    return this.peersHolder.pageCount;
  }

  async load(filters?: { serverId?: string; userId?: string }) {
    await this.peersHolder.load(filters ?? {});
  }

  async goToPage(page: number) {
    await this.peersHolder.goToPage(page, { refresh: true });
  }

  async setPageSize(pageSize: number) {
    this.peersHolder.setPageSize(pageSize);
    await this.peersHolder.reload({ refresh: true });
  }

  async createPeer(serverId: string, params: IWgPeerCreateRequestDto) {
    return this.createPeerMutation.execute({ serverId, params }, async args => {
      const res = await this._apiService.createPeer(
        { serverId: args.serverId },
        args.params,
      );

      if (res.data) {
        await this.peersHolder.reload({ refresh: true });
      }

      return res;
    });
  }

  addPeer(peer: WgPeerDto) {
    this.peersHolder.appendItem(peer);
  }

  removePeer(id: string) {
    this.peersHolder.removeItem(id);
  }

  updatePeer(peer: WgPeerDto) {
    this.peersHolder.updateItem(peer.id, peer);
  }
}
