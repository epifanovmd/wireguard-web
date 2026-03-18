import { DataHolder } from "@force-dev/utils";
import { makeAutoObservable } from "mobx";

import { IApiService } from "~@api";
import { formatter } from "~@common";
import { IChartPoint } from "~@components/wgChart";

import {
  WgPeerActivePayload,
  WgPeerStatsPayload,
  WgPeerStatusPayload,
} from "../../socket/events";
import { IWgSocketService } from "../../socket/wg";
import { IPeerStatsStore } from "./PeerStats.types";

@IPeerStatsStore({ inSingleton: true })
export class PeerStatsStore implements IPeerStatsStore {
  public holder = new DataHolder<WgPeerStatsPayload>();
  public statusHolder = new DataHolder<WgPeerStatusPayload>();
  public activeHolder = new DataHolder<WgPeerActivePayload>();
  public speedPoints: IChartPoint[] = [];
  public trafficPoints: IChartPoint[] = [];

  constructor(
    @IApiService() private _apiService: IApiService,
    @IWgSocketService() private _wgSocket: IWgSocketService,
  ) {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  get stats() {
    return this.holder.d;
  }

  get status() {
    return this.statusHolder.d;
  }

  get active() {
    return this.activeHolder.d;
  }

  subscribe(peerId: string, from?: string, to?: string) {
    this.speedPoints = [];
    this.trafficPoints = [];

    this._apiService.getPeerStats({ peerId, from, to }).then(res => {
      if (res.data) {
        this.speedPoints = res.data.speed.slice(-60).map(s => ({
          t: formatter.date.formatTime(s.timestamp),
          rx: s.rxSpeedBps,
          tx: s.txSpeedBps,
        }));
        this.trafficPoints = res.data.traffic.slice(-60).map(t => ({
          t: formatter.date.formatTime(t.timestamp),
          rx: t.rxBytes,
          tx: t.txBytes,
        }));
      }
    });

    return this._wgSocket.subscribePeer(peerId, {
      onStats: s => {
        this.holder.setData(s);
        const t = formatter.date.formatTime(s.timestamp);
        this.speedPoints = [
          ...this.speedPoints.slice(-59),
          { t, rx: s.rxSpeedBps, tx: s.txSpeedBps },
        ];
        this.trafficPoints = [
          ...this.trafficPoints.slice(-59),
          { t, rx: s.rxBytes, tx: s.txBytes },
        ];
      },
      onStatus: s => {
        this.statusHolder.setData(s);
      },
      onActive: a => {
        this.activeHolder.setData(a);
      },
    });
  }
}
