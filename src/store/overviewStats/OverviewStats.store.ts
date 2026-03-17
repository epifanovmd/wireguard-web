import { DataHolder } from "@force-dev/utils";
import { format } from "date-fns";
import { makeAutoObservable } from "mobx";

import { IChartPoint } from "~@components/wgChart";

import { WgOverviewStatsPayload } from "../../socket/events";
import { IWgSocketService } from "../../socket/wg";
import { IOverviewStatsStore } from "./OverviewStats.types";

@IOverviewStatsStore({ inSingleton: true })
export class OverviewStatsStore implements IOverviewStatsStore {
  public holder = new DataHolder<WgOverviewStatsPayload>();
  public speedPoints: IChartPoint[] = [];

  constructor(@IWgSocketService() private _wgSocket: IWgSocketService) {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  get stats() {
    return this.holder.d;
  }

  subscribe() {
    return this._wgSocket.subscribeOverview({
      onStats: s => {
        this.holder.setData(s);
        this.speedPoints = [
          ...this.speedPoints.slice(-59),
          {
            t: format(s.timestamp, "HH:mm:ss"),
            rx: s.rxSpeedBps,
            tx: s.txSpeedBps,
          },
        ];
      },
    });
  }
}
