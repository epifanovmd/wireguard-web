import { DataHolder, ValueHolder } from "@force-dev/utils";
import { makeAutoObservable } from "mobx";

import { IApiService } from "~@api";
import { formatter } from "~@common";
import { IChartPoint } from "~@components/wgChart";

import {
  IWgSocketService,
  WgServerStatsPayload,
  WgServerStatusPayload,
} from "../../socket";
import { IServerStatsStore } from "./ServerStats.types";

@IServerStatsStore({ inSingleton: true })
export class ServerStatsStore implements IServerStatsStore {
  public holder = new DataHolder<WgServerStatsPayload>();
  public statusHolder = new DataHolder<WgServerStatusPayload>();
  public speedPointsHolder = new DataHolder<IChartPoint[]>([]);
  public trafficPointsHolder = new DataHolder<IChartPoint[]>([]);

  constructor(
    @IApiService() private _apiService: IApiService,
    @IWgSocketService() private _wgSocket: IWgSocketService,
  ) {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  public get speedPoints() {
    return this.speedPointsHolder.d ?? [];
  }
  public get trafficPoints() {
    return this.trafficPointsHolder.d ?? [];
  }

  get stats() {
    return this.holder.d;
  }

  get status() {
    return this.statusHolder.d;
  }

  loadServerStats = async (serverId: string, from?: string, to?: string) => {
    this.speedPointsHolder.setLoading();
    this.trafficPointsHolder.setLoading();

    const res = await this._apiService.getServerStats({ serverId, from, to });

    if (res.data) {
      this.speedPointsHolder.setData(
        res.data.speed.map(s => ({
          t: formatter.date.formatTime(s.timestamp),
          rx: s.rxSpeedBps,
          tx: s.txSpeedBps,
        })),
      );
      this.trafficPointsHolder.setData(
        res.data.traffic.map(t => ({
          t: formatter.date.formatTime(t.timestamp),
          rx: t.rxBytes,
          tx: t.txBytes,
        })),
      );
    }
  };

  subscribe(serverId: string) {
    return this._wgSocket.subscribeServer(serverId, {
      onStats: s => {
        this.holder.setData(s);
        const t = formatter.date.formatTime(s.timestamp);
        this.speedPointsHolder.setData([
          ...this.speedPoints,
          { t, rx: s.rxSpeedBps, tx: s.txSpeedBps },
        ]);
        this.trafficPointsHolder.setData([
          ...this.trafficPoints,
          { t, rx: s.totalRxBytes, tx: s.totalTxBytes },
        ]);
      },
      onStatus: s => {
        this.statusHolder.setData(s);
      },
    });
  }

  unsubscribe(serverId: string) {
    this._wgSocket.unsubscribeServer(serverId);
  }
}
