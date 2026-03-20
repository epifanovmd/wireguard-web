import { makeAutoObservable, runInAction } from "mobx";

import { IApiService } from "~@api";
import { formatter } from "~@common";
import { IChartPoint } from "~@components/wgChart";
import { EntityHolder } from "~@core/holders";

import { IWgSocketService, WgOverviewStatsPayload } from "../../socket";
import { IOverviewStatsStore } from "./OverviewStats.types";

@IOverviewStatsStore({ inSingleton: true })
export class OverviewStatsStore implements IOverviewStatsStore {
  public holder = new EntityHolder<WgOverviewStatsPayload>();
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

  load(from?: string, to?: string) {
    this.speedPoints = [];
    this.trafficPoints = [];
    this.isLoading = true;

    this._apiService.getOverviewStats({ from, to }).then(res => {
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
    });
  }

  subscribe(from?: string, to?: string) {
    this.load(from, to);

    return this._wgSocket.subscribeOverview({
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
    });
  }

  private _appendPoint(points: IChartPoint[], point: IChartPoint): void {
    points.shift();
    points.push(point);
  }
}
