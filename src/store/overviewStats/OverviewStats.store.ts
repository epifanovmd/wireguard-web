import { subHours } from "date-fns";
import { computed, makeObservable, runInAction } from "mobx";

import { IApiService } from "~@api";
import { formatter } from "~@common";
import { EntityHolder } from "~@core/holders";
import { StatsChartBase } from "~@store/shared/StatsChartBase";

import { IWgSocketService, WgOverviewStatsPayload } from "../../socket";
import { IOverviewStatsStore } from "./OverviewStats.types";

@IOverviewStatsStore({ inSingleton: true })
export class OverviewStatsStore
  extends StatsChartBase
  implements IOverviewStatsStore
{
  public holder = new EntityHolder<WgOverviewStatsPayload>();

  constructor(
    @IApiService() private _apiService: IApiService,
    @IWgSocketService() private _wgSocket: IWgSocketService,
  ) {
    super();
    makeObservable(
      this,
      {
        stats: computed,
        speedPoints: computed,
        trafficPoints: computed,
        isLoading: computed,
      },
      { autoBind: true },
    );
  }

  get stats() {
    return this.holder.data;
  }

  async load(
    from: string = subHours(new Date(), 1).toISOString(),
    to?: string,
  ) {
    this._startLoading();
    const res = await this._apiService.getOverviewStats({ from, to });

    runInAction(() => {
      if (res.data) {
        this._setPoints(
          res.data.speed.map(s => ({
            t: formatter.date.formatTime(s.timestamp),
            rx: s.rxSpeedBps,
            tx: s.txSpeedBps,
          })),
          res.data.traffic.map(t => ({
            t: formatter.date.formatTime(t.timestamp),
            rx: t.rxBytes,
            tx: t.txBytes,
          })),
        );
      } else {
        this._setPoints([], []);
      }
    });
  }

  subscribe(from?: string, to?: string) {
    this.load(from, to);

    return this._wgSocket.subscribeOverview({
      onStats: s => {
        this.holder.setData(s);
        const t = formatter.date.formatTime(s.timestamp);

        runInAction(() => {
          this._appendStats(
            { t, rx: s.rxSpeedBps, tx: s.txSpeedBps },
            { t, rx: s.totalRxBytes, tx: s.totalTxBytes },
          );
        });
      },
    });
  }
}
