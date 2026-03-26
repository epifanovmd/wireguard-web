import { makeAutoObservable } from "mobx";

import { IApiService } from "~@api";
import {
  IWgPeerCreateRequestDto,
  IWgPeerUpdateRequestDto,
  WgPeerDto,
} from "~@api/api-gen/data-contracts";
import { EntityHolder, MutationHolder } from "~@core/holders";
import { PeerModel } from "~@models";

import { IPeerDataStore } from "./PeerDataStore.types";

@IPeerDataStore({ inSingleton: true })
export class PeerDataStore implements IPeerDataStore {
  public peerHolder = new EntityHolder<WgPeerDto, string>({
    onFetch: id => this._apiService.getPeer(id),
  });
  public qrHolder = new EntityHolder<{ dataUrl: string }>();
  public updatePeerMutation = new MutationHolder<
    { id: string; params: IWgPeerUpdateRequestDto },
    WgPeerDto
  >();

  constructor(@IApiService() private _apiService: IApiService) {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  get peer() {
    return this.peerHolder.data;
  }

  get peerModel() {
    return this.peerHolder.data ? new PeerModel(this.peerHolder.data) : null;
  }

  async loadPeer(id: string) {
    const res = await this.peerHolder.load(id);

    return res.data;
  }

  async createPeer(serverId: string, params: IWgPeerCreateRequestDto) {
    return this._apiService.createPeer(serverId, params);
  }

  async updatePeer(id: string, params: IWgPeerUpdateRequestDto) {
    return this.updatePeerMutation.execute({ id, params }, async args => {
      const res = await this._apiService.updatePeer(args.id, args.params);

      if (res.data) {
        this.peerHolder.setData(res.data);
      }

      return res;
    });
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
    const res = await this._apiService.assignPeer(id, { userId });

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
    const res = await this.qrHolder.fromApi(
      () => this._apiService.getPeerQrCode(id) as any,
    );

    return res.data ?? undefined;
  }
}
