import { makeAutoObservable } from "mobx";

import { formatter } from "~@common";
import { IChartPoint } from "~@components/wgChart";
import { EntityHolder } from "~@core/holders";

import { IWgSocketService, WgOverviewStatsPayload } from "../../socket";
import { IOverviewStatsStore } from "./OverviewStats.types";

@IOverviewStatsStore({ inSingleton: true })
export class OverviewStatsStore implements IOverviewStatsStore {
  public holder = new EntityHolder<WgOverviewStatsPayload>();
  public speedPoints: IChartPoint[] = [];
  public trafficPoints: IChartPoint[] = [];

  constructor(@IWgSocketService() private _wgSocket: IWgSocketService) {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  get stats() {
    return this.holder.data;
  }

  subscribe() {
    return this._wgSocket.subscribeOverview({
      onStats: s => {
        this.holder.setData(s);
        this.speedPoints = [
          ...this.speedPoints.slice(-59),
          {
            t: formatter.date.formatTime(s.timestamp),
            rx: s.rxSpeedBps,
            tx: s.txSpeedBps,
          },
        ];
        this.trafficPoints = [
          ...this.trafficPoints.slice(-59),
          {
            t: formatter.date.formatTime(s.timestamp),
            rx: s.totalRxBytes,
            tx: s.totalTxBytes,
          },
        ];
      },
    });
  }
}
