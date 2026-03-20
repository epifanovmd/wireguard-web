import { makeAutoObservable, runInAction } from "mobx";

import { IApiService } from "~@api";
import { formatter } from "~@common";
import { IChartPoint } from "~@components/wgChart";
import { EntityHolder } from "~@core/holders";

import {
  IWgSocketService,
  WgPeerActivePayload,
  WgPeerStatsPayload,
  WgPeerStatusPayload,
} from "../../socket";
import { IPeerStatsStore } from "./PeerStats.types";

@IPeerStatsStore({ inSingleton: true })
export class PeerStatsStore implements IPeerStatsStore {
  public holder = new EntityHolder<WgPeerStatsPayload>();
  public statusHolder = new EntityHolder<WgPeerStatusPayload>();
  public activeHolder = new EntityHolder<WgPeerActivePayload>();
  public speedPoints: IChartPoint[] = [];
  public trafficPoints: IChartPoint[] = [];

  constructor(
    @IApiService() private _apiService: IApiService,
    @IWgSocketService() private _wgSocket: IWgSocketService,
  ) {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  get stats() {
    return this.holder.data;
  }

  get status() {
    return this.statusHolder.data;
  }

  get active() {
    return this.activeHolder.data;
  }

  subscribe(peerId: string, from?: string, to?: string) {
    this.speedPoints = [];
    this.trafficPoints = [];

    this._apiService.getPeerStats({ peerId, from, to }).then(res => {
      if (res.data) {
        const speedPoints = res.data.speed.slice(-60).map(s => ({
          t: formatter.date.formatTime(s.timestamp),
          rx: s.rxSpeedBps,
          tx: s.txSpeedBps,
        }));
        const trafficPoints = res.data.traffic.slice(-60).map(t => ({
          t: formatter.date.formatTime(t.timestamp),
          rx: t.rxBytes,
          tx: t.txBytes,
        }));

        runInAction(() => {
          this.speedPoints = speedPoints;
          this.trafficPoints = trafficPoints;
        });
      }
    });

    return this._wgSocket.subscribePeer(peerId, {
      onStats: s => {
        this.holder.setData(s);
        const t = formatter.date.formatTime(s.timestamp);

        const speedPoints = [
          ...this.speedPoints.slice(-59),
          { t, rx: s.rxSpeedBps, tx: s.txSpeedBps },
        ];
        const trafficPoints = [
          ...this.trafficPoints.slice(-59),
          { t, rx: s.rxBytes, tx: s.txBytes },
        ];

        runInAction(() => {
          this.speedPoints = speedPoints;
          this.trafficPoints = trafficPoints;
        });
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
