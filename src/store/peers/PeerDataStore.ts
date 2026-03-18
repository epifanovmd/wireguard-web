import { DataHolder } from "@force-dev/utils";
import { makeAutoObservable } from "mobx";

import { IApiService } from "~@api";
import {
  IWgPeerCreateRequestDto,
  IWgPeerUpdateRequestDto,
  WgPeerDto,
} from "~@api/api-gen/data-contracts";
import { PeerModel } from "~@models";

import { IPeerDataStore } from "./PeerDataStore.types";

@IPeerDataStore({ inSingleton: true })
export class PeerDataStore implements IPeerDataStore {
  public peerHolder = new DataHolder<WgPeerDto>();
  public qrHolder = new DataHolder<{ dataUrl: string }>();

  constructor(@IApiService() private _apiService: IApiService) {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  get peer() {
    return this.peerHolder.d;
  }

  get peerModel() {
    return this.peerHolder.d ? new PeerModel(this.peerHolder.d) : undefined;
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
    return this._apiService.createPeer(serverId, params);
  }

  async updatePeer(id: string, params: IWgPeerUpdateRequestDto) {
    const res = await this._apiService.updatePeer(id, params);

    if (res.data) {
      this.peerHolder.setData(res.data);
    }

    return res;
  }

  async deletePeer(id: string) {
    return this._apiService.deletePeer(id);
  }

  async startPeer(id: string) {
    const res = await this._apiService.startPeer(id);

    if (res.data) {
      this.peerHolder.setData(res.data);
    }

    return res;
  }

  async stopPeer(id: string) {
    const res = await this._apiService.stopPeer(id);

    if (res.data) {
      this.peerHolder.setData(res.data);
    }

    return res;
  }

  async assignPeer(id: string, userId: string) {
    const res = await this._apiService.assignPeer({ id, userId });

    if (res.data) {
      this.peerHolder.setData(res.data);
    }

    return res;
  }

  async revokePeer(id: string) {
    const res = await this._apiService.revokePeer(id);

    if (res.data) {
      this.peerHolder.setData(res.data);
    }

    return res;
  }

  async rotatePsk(id: string) {
    const res = await this._apiService.rotatePresharedKey(id);

    if (res.data) {
      this.peerHolder.setData(res.data);
    }

    return res;
  }

  async removePsk(id: string) {
    const res = await this._apiService.removePresharedKey(id);

    if (res.data) {
      this.peerHolder.setData(res.data);
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
}
