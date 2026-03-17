import { DataHolder } from "@force-dev/utils";
import { format } from "date-fns";
import { makeAutoObservable } from "mobx";

import { IChartPoint } from "~@components/wgChart";

import {
  WgServerStatsPayload,
  WgServerStatusPayload,
} from "../../socket/events";
import { IWgSocketService } from "../../socket/wg";
import { IServerStatsStore } from "./ServerStats.types";

@IServerStatsStore({ inSingleton: true })
export class ServerStatsStore implements IServerStatsStore {
  public holder = new DataHolder<WgServerStatsPayload>();
  public statusHolder = new DataHolder<WgServerStatusPayload>();
  public speedPoints: IChartPoint[] = [];
  public trafficPoints: IChartPoint[] = [];

  constructor(@IWgSocketService() private _wgSocket: IWgSocketService) {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  get stats() {
    return this.holder.d;
  }

  get status() {
    return this.statusHolder.d;
  }

  subscribe(serverId: string) {
    this.speedPoints = [];
    this.trafficPoints = [];

    return this._wgSocket.subscribeServer(serverId, {
      onStats: s => {
        this.holder.setData(s);
        const t = format(s.timestamp, "HH:mm:ss");
        this.speedPoints = [
          ...this.speedPoints.slice(-59),
          { t, rx: s.rxSpeedBps, tx: s.txSpeedBps },
        ];
        this.trafficPoints = [
          ...this.trafficPoints.slice(-59),
          { t, rx: s.totalRxBytes, tx: s.totalTxBytes },
        ];
      },
      onStatus: s => {
        this.statusHolder.setData(s);
      },
    });
  }
}
