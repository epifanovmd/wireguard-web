import { DataHolder } from "@force-dev/utils";
import { makeAutoObservable } from "mobx";

import { IApiService } from "~@api";
import {
  IWgPeerCreateRequestDto,
  IWgPeerListDto,
  IWgPeerUpdateRequestDto,
  WgPeerDto,
} from "~@api/api-gen/data-contracts";
import { PeerModel } from "~@models";

import { IPeersDataStore } from "./PeersData.types";

@IPeersDataStore({ inSingleton: true })
export class PeersDataStore implements IPeersDataStore {
  public listHolder = new DataHolder<IWgPeerListDto>();
  public peerHolder = new DataHolder<WgPeerDto>();
  public qrHolder = new DataHolder<{ dataUrl: string }>();

  constructor(@IApiService() private _apiService: IApiService) {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  get peers() {
    return this.listHolder.d?.data ?? [];
  }

  get total() {
    return this.listHolder.d?.count ?? 0;
  }

  get models() {
    return this.peers.map(p => new PeerModel(p));
  }

  get isLoading() {
    return this.listHolder.isLoading;
  }

  get peer() {
    return this.peerHolder.d;
  }

  get peerModel() {
    return this.peerHolder.d ? new PeerModel(this.peerHolder.d) : undefined;
  }

  async loadPeersByServer(serverId: string) {
    this.listHolder.setLoading();
    const res = await this._apiService.getPeersByServer(serverId);

    if (res.error) {
      this.listHolder.setError(res.error.message);
    } else if (res.data) {
      this.listHolder.setData(res.data);
    }
  }

  async loadPeersByUser(userId: string) {
    this.listHolder.setLoading();
    const res = await this._apiService.getPeersByUser(userId);

    if (res.error) {
      this.listHolder.setError(res.error.message);
    } else if (res.data) {
      this.listHolder.setData(res.data);
    }
  }

  async loadMyPeers() {
    this.listHolder.setLoading();
    const res = await this._apiService.getMyPeers();

    if (res.error) {
      this.listHolder.setError(res.error.message);
    } else if (res.data) {
      this.listHolder.setData(res.data);
    }
  }

  async loadPeer(id: string) {
    this.peerHolder.setLoading();
    const res = await this._apiService.getPeer(id);

    if (res.error) {
      this.peerHolder.setError(res.error.message);
    } else if (res.data) {
      this.peerHolder.setData(res.data);

      return res.data;
    }

    return undefined;
  }

  async createPeer(serverId: string, params: IWgPeerCreateRequestDto) {
    const res = await this._apiService.createPeer(serverId, params);

    if (res.data) {
      this.listHolder.setData({
        count: this.total + 1,
        data: [...this.peers, res.data],
      });
    }

    return res;
  }

  async updatePeer(id: string, params: IWgPeerUpdateRequestDto) {
    const res = await this._apiService.updatePeer(id, params);

    if (res.data) {
      this.peerHolder.setData(res.data);
      this._updateInList(res.data);
    }

    return res;
  }

  async deletePeer(id: string) {
    const res = await this._apiService.deletePeer(id);

    if (!res.error) {
      this.listHolder.setData({
        count: Math.max(0, this.total - 1),
        data: this.peers.filter(p => p.id !== id),
      });
    }

    return res;
  }

  async enablePeer(id: string) {
    const res = await this._apiService.enablePeer(id);

    if (res.data) {
      this.peerHolder.setData(res.data);
      this._updateInList(res.data);
    }

    return res;
  }

  async disablePeer(id: string) {
    const res = await this._apiService.disablePeer(id);

    if (res.data) {
      this.peerHolder.setData(res.data);
      this._updateInList(res.data);
    }

    return res;
  }

  async assignPeer(id: string, userId: string) {
    const res = await this._apiService.assignPeer({ id, userId });

    if (res.data) {
      this.peerHolder.setData(res.data);
      this._updateInList(res.data);
    }

    return res;
  }

  async revokePeer(id: string) {
    const res = await this._apiService.revokePeer(id);

    if (res.data) {
      this.peerHolder.setData(res.data);
      this._updateInList(res.data);
    }

    return res;
  }

  async rotatePsk(id: string) {
    const res = await this._apiService.rotatePresharedKey(id);

    if (res.data) {
      this.peerHolder.setData(res.data);
      this._updateInList(res.data);
    }

    return res;
  }

  async removePsk(id: string) {
    const res = await this._apiService.removePresharedKey(id);

    if (res.data) {
      this.peerHolder.setData(res.data);
      this._updateInList(res.data);
    }

    return res;
  }

  async loadQrCode(id: string) {
    this.qrHolder.setLoading();
    const res = await this._apiService.getPeerQrCode(id);

    if (res.data) {
      this.qrHolder.setData(res.data as any);

      return res.data;
    }

    return undefined;
  }

  private _updateInList(peer: WgPeerDto) {
    if (this.listHolder.d) {
      this.listHolder.setData({
        ...this.listHolder.d,
        data: this.listHolder.d.data.map(p => (p.id === peer.id ? peer : p)),
      });
    }
  }
}
