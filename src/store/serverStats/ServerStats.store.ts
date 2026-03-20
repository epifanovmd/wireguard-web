import { subHours } from "date-fns";
import { computed, makeObservable, runInAction } from "mobx";

import { IApiService } from "~@api";
import { formatter } from "~@common";
import { EntityHolder } from "~@core/holders";
import { StatsChartBase } from "~@store/shared/StatsChartBase";

import {
  IWgSocketService,
  WgServerStatsPayload,
  WgServerStatusPayload,
} from "../../socket";
import { IServerStatsStore } from "./ServerStats.types";

@IServerStatsStore({ inSingleton: true })
export class ServerStatsStore
  extends StatsChartBase
  implements IServerStatsStore
{
  public holder = new EntityHolder<WgServerStatsPayload>();
  public statusHolder = new EntityHolder<WgServerStatusPayload>();

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

  get status() {
    return this.statusHolder.data;
  }

  async load(
    serverId: string,
    from: string = subHours(new Date(), 1).toISOString(),
    to?: string,
    peerId?: string,
  ) {
    this._startLoading();
    const res = await this._apiService.getServerStats({
      serverId,
      peerId,
      from,
      to,
    });

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

  subscribe(serverId: string, from?: string, to?: string, peerId?: string) {
    this.load(serverId, from, to, peerId);

    return this._wgSocket.subscribeServer(serverId, {
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
      onStatus: s => this.statusHolder.setData(s),
    });
  }

  unsubscribe(serverId: string) {
    this._wgSocket.unsubscribeServer(serverId);
  }
}
