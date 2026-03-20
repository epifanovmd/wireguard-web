import { makeAutoObservable, runInAction } from "mobx";

import { IApiService } from "~@api";
import { formatter } from "~@common";
import { IChartPoint } from "~@components/wgChart";
import { EntityHolder } from "~@core/holders";

import {
  IWgSocketService,
  WgServerStatsPayload,
  WgServerStatusPayload,
} from "../../socket";
import { IServerStatsStore } from "./ServerStats.types";

@IServerStatsStore({ inSingleton: true })
export class ServerStatsStore implements IServerStatsStore {
  public holder = new EntityHolder<WgServerStatsPayload>();
  public statusHolder = new EntityHolder<WgServerStatusPayload>();
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

  async load(serverId: string, from?: string, to?: string) {
    this.speedPoints = [];
    this.trafficPoints = [];
    this.isLoading = true;

    const res = await this._apiService.getServerStats({ serverId, from, to });

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

  subscribe(serverId: string, from?: string, to?: string) {
    this.load(serverId, from, to);

    return this._wgSocket.subscribeServer(serverId, {
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
            rx: s.totalRxBytes,
            tx: s.totalTxBytes,
          });
        });
      },
      onStatus: s => {
        this.statusHolder.setData(s);
      },
    });
  }

  unsubscribe(serverId: string) {
    this._wgSocket.unsubscribeServer(serverId);
  }

  private _appendPoint(points: IChartPoint[], point: IChartPoint): void {
    points.shift();
    points.push(point);
  }
}
