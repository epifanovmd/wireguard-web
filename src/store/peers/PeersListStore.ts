import { makeAutoObservable } from "mobx";

import { IApiService } from "~@api";
import {
  IWgPeerCreateRequestDto,
  WgPeerDto,
} from "~@api/api-gen/data-contracts";
import { PagedHolder } from "~@core/holders";
import { PeerModel } from "~@models";

import { IPeersListStore, PeerListArgs } from "./PeersListStore.types";

@IPeersListStore({ inSingleton: true })
export class PeersListStore implements IPeersListStore {
  public peersHolder = new PagedHolder<WgPeerDto, PeerListArgs>({
    pageSize: 1000,
    keyExtractor: p => p.id,
    onFetch: async ({ offset, limit }, { serverId, userId } = {}) => {
      if (serverId) {
        return this._apiService.getPeersByServer({ serverId, offset, limit });
      }

      if (userId) {
        return this._apiService.getPeersByUser({ userId, offset, limit });
      }

      return this._apiService.getMyPeers({ offset, limit });
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

  async loadByServer(serverId: string) {
    await this.peersHolder.load({ serverId });
  }

  async loadByUser(userId: string) {
    await this.peersHolder.load({ userId });
  }

  async loadMine() {
    await this.peersHolder.load({});
  }

  async goToPage(page: number) {
    await this.peersHolder.goToPage(page, { refresh: true });
  }

  async setPageSize(pageSize: number) {
    this.peersHolder.setPageSize(pageSize);
    await this.peersHolder.reload({ refresh: true });
  }

  async createPeer(serverId: string, params: IWgPeerCreateRequestDto) {
    const res = await this._apiService.createPeer(serverId, params);

    if (res.data) {
      await this.peersHolder.reload({ refresh: true });
    }

    return res;
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
