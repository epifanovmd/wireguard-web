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
  public isLoading = false;
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

  async load(peerId: string, from?: string, to?: string) {
    this.speedPoints = [];
    this.trafficPoints = [];
    this.isLoading = true;

    const res = await this._apiService.getPeerStats({ peerId, from, to });

    runInAction(() => {
      if (res.data) {
        this.speedPoints = res.data.speed.map(s => ({
          t: formatter.date.formatTime(s.timestamp),
          rx: s.rxSpeedBps,
          tx: s.txSpeedBps,
        }));
        this.trafficPoints = res.data.traffic.map(t => ({
          t: formatter.date.formatTime(t.timestamp),
          rx: t.rxBytes,
          tx: t.txBytes,
        }));
      }
      this.isLoading = false;
    });
  }

  subscribe(peerId: string, from?: string, to?: string) {
    this.load(peerId, from, to);

    return this._wgSocket.subscribePeer(peerId, {
      onStats: s => {
        this.holder.setData(s);
        const t = formatter.date.formatTime(s.timestamp);

        runInAction(() => {
          this._appendPoint(this.speedPoints, {
            t,
            rx: s.rxSpeedBps,
            tx: s.txSpeedBps,
          });
          this._appendPoint(this.trafficPoints, {
            t,
            rx: s.rxBytes,
            tx: s.txBytes,
          });
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

  private _appendPoint(points: IChartPoint[], point: IChartPoint): void {
    points.shift();
    points.push(point);
  }
}
