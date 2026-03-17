import { DataHolder } from "@force-dev/utils";
import { format } from "date-fns";
import { makeAutoObservable } from "mobx";

import { IChartPoint } from "~@components/wgChart";

import { WgPeerStatsPayload, WgPeerStatusPayload } from "../../socket/events";
import { IWgSocketService } from "../../socket/wg";
import { IPeerStatsStore } from "./PeerStats.types";

@IPeerStatsStore({ inSingleton: true })
export class PeerStatsStore implements IPeerStatsStore {
  public holder = new DataHolder<WgPeerStatsPayload>();
  public statusHolder = new DataHolder<WgPeerStatusPayload>();
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

  subscribe(peerId: string) {
    this.speedPoints = [];
    this.trafficPoints = [];

    return this._wgSocket.subscribePeer(peerId, {
      onStats: s => {
        this.holder.setData(s);
        const t = format(s.timestamp, "HH:mm:ss");
        this.speedPoints = [
          ...this.speedPoints.slice(-59),
          { t, rx: s.rxSpeedBps, tx: s.txSpeedBps },
        ];
        this.trafficPoints = [
          ...this.trafficPoints.slice(-59),
          { t, rx: s.rxBytes, tx: s.txBytes },
        ];
      },
      onStatus: s => {
        this.statusHolder.setData(s);
      },
    });
  }
}
