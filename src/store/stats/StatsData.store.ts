import { DataHolder } from "@force-dev/utils";
import { makeAutoObservable } from "mobx";

import { IApiService } from "~@api";
import {
  IWgPeerStatsResponse,
  IWgServerStatsResponse,
} from "~@api/api-gen/data-contracts";

import { IStatsDataStore } from "./StatsData.types";

@IStatsDataStore({ inSingleton: true })
export class StatsDataStore implements IStatsDataStore {
  public peerStatsHolder = new DataHolder<IWgPeerStatsResponse>();
  public serverStatsHolder = new DataHolder<IWgServerStatsResponse>();
  public peerTrafficHolder = new DataHolder<any[]>();
  public serverTrafficHolder = new DataHolder<any[]>();
  public liveSpeedPoints: { timestamp: number; rx: number; tx: number }[] = [];

  constructor(@IApiService() private _apiService: IApiService) {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  get peerStats() {
    return this.peerStatsHolder.d;
  }

  get serverStats() {
    return this.serverStatsHolder.d;
  }

  addLiveSpeedPoint(rx: number, tx: number) {
    this.liveSpeedPoints = [
      ...this.liveSpeedPoints.slice(-59),
      { timestamp: Date.now(), rx, tx },
    ];
  }

  async loadPeerStats(peerId: string, from?: string, to?: string) {
    this.peerStatsHolder.setLoading();
    const res = await this._apiService.getPeerStats({ peerId, from, to });

    if (res.data) {
      this.peerStatsHolder.setData(res.data);

      return res.data;
    }

    return undefined;
  }

  async loadServerStats(serverId: string, from?: string, to?: string) {
    this.serverStatsHolder.setLoading();
    const res = await this._apiService.getServerStats({ serverId, from, to });

    if (res.data) {
      this.serverStatsHolder.setData(res.data);

      return res.data;
    }

    return undefined;
  }

  async loadPeerTraffic(peerId: string, from?: string, to?: string) {
    this.peerTrafficHolder.setLoading();
    const res = await this._apiService.getPeerTraffic({ peerId, from, to });

    if (res.data) {
      this.peerTrafficHolder.setData(res.data as any);

      return res.data;
    }

    return undefined;
  }

  async loadServerTraffic(serverId: string, from?: string, to?: string) {
    this.serverTrafficHolder.setLoading();
    const res = await this._apiService.getServerTraffic({ serverId, from, to });

    if (res.data) {
      this.serverTrafficHolder.setData(res.data as any);

      return res.data;
    }

    return undefined;
  }
}
