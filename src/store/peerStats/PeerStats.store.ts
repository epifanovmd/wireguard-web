import { subHours } from "date-fns";
import { computed, makeObservable, runInAction } from "mobx";

import { IApiService } from "~@api";
import { formatter } from "~@common";
import { EntityHolder } from "~@core/holders";
import { StatsChartBase } from "~@store/shared/StatsChartBase";

import {
  IWgSocketService,
  WgPeerActivePayload,
  WgPeerStatsPayload,
  WgPeerStatusPayload,
} from "../../socket";
import { IPeerStatsStore } from "./PeerStats.types";

@IPeerStatsStore({ inSingleton: true })
export class PeerStatsStore extends StatsChartBase implements IPeerStatsStore {
  public holder = new EntityHolder<WgPeerStatsPayload>();
  public statusHolder = new EntityHolder<WgPeerStatusPayload>();
  public activeHolder = new EntityHolder<WgPeerActivePayload>();

  constructor(
    @IApiService() private _apiService: IApiService,
    @IWgSocketService() private _wgSocket: IWgSocketService,
  ) {
    super();
    makeObservable(
      this,
      {
        speedPoints: computed,
        trafficPoints: computed,
        isLoading: computed,
        stats: computed,
        status: computed,
        active: computed,
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

  get active() {
    return this.activeHolder.data;
  }

  async load(
    peerId: string,
    from: string = subHours(new Date(), 1).toISOString(),
    to?: string,
  ) {
    this._startLoading();
    const res = await this._apiService.getPeerStats({ peerId, from, to });

    runInAction(() => {
      if (res.data) {
        this._setPoints(
          res.data.speed.map(s => ({
            t: formatter.date.formatChartTime(s.timestamp),
            rx: s.rxSpeedBps,
            tx: s.txSpeedBps,
          })),
          res.data.traffic.map(t => ({
            t: formatter.date.formatChartTime(t.timestamp),
            rx: t.rxBytes,
            tx: t.txBytes,
          })),
        );
      }
    });
  }

  subscribe(peerId: string, from?: string, to?: string): () => void {
    let unsubFn: (() => void) | undefined;

    this.load(peerId, from, to).then(() => {
      unsubFn = this._wgSocket.subscribePeer(peerId, {
        onStats: s => {
          this.holder.setData(s);
          const t = formatter.date.formatChartTime(s.timestamp);

          if (this.chartHolder.data?.speed.length) {
            runInAction(() => {
              this._appendStats(
                { t, rx: s.rxSpeedBps, tx: s.txSpeedBps },
                { t, rx: s.rxBytes, tx: s.txBytes },
              );
            });
          }
        },
        onStatus: s => this.statusHolder.setData(s),
        onActive: a => this.activeHolder.setData(a),
      });
    });

    return () => unsubFn?.();
  }
}
