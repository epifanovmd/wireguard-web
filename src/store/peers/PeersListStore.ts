import { ListCollectionHolder } from "@force-dev/utils";
import { makeAutoObservable } from "mobx";

import { IApiService } from "~@api";
import {
  IWgPeerCreateRequestDto,
  WgPeerDto,
} from "~@api/api-gen/data-contracts";
import { PeerModel } from "~@models";

import { IPeersListStore, PeerListArgs } from "./PeersListStore.types";

@IPeersListStore({ inSingleton: true })
export class PeersListStore implements IPeersListStore {
  public listHolder = new ListCollectionHolder<WgPeerDto, PeerListArgs>();

  private _context: PeerListArgs = {};

  constructor(@IApiService() private _apiService: IApiService) {
    makeAutoObservable(this, {}, { autoBind: true });

    this.listHolder.initialize({
      keyExtractor: p => p.id,
      onFetchData: async () => {
        const { serverId, userId } = this._context;
        let res;

        if (serverId) {
          res = await this._apiService.getPeersByServer(serverId);
        } else if (userId) {
          res = await this._apiService.getPeersByUser(userId);
        } else {
          res = await this._apiService.getMyPeers();
        }

        const data = res.data?.data ?? [];

        this.listHolder.updateData(data, { replace: true });

        return data;
      },
      pageSize: 1000,
    });
  }

  get models() {
    return this.listHolder.d.map(p => new PeerModel(p));
  }

  get isLoading() {
    return this.listHolder.isLoading;
  }

  get total() {
    return this.listHolder.d.length;
  }

  async loadByServer(serverId: string) {
    this._context = { serverId };
    await this.listHolder.performRefresh();
  }

  async loadByUser(userId: string) {
    this._context = { userId };
    await this.listHolder.performRefresh();
  }

  async loadMine() {
    this._context = {};
    await this.listHolder.performRefresh();
  }

  async createPeer(serverId: string, params: IWgPeerCreateRequestDto) {
    const res = await this._apiService.createPeer(serverId, params);

    if (res.data) {
      this.addPeer(res.data);
    }

    return res;
  }

  addPeer(peer: WgPeerDto) {
    this.listHolder.updateData([...this.listHolder.d, peer], { replace: true });
  }

  removePeer(id: string) {
    this.listHolder.updateData(
      this.listHolder.d.filter(p => p.id !== id),
      { replace: true },
    );
  }

  updatePeer(peer: WgPeerDto) {
    this.listHolder.updateData(
      this.listHolder.d.map(p => (p.id === peer.id ? peer : p)),
      { replace: true },
    );
  }
}
