import { makeObservable, observable, ObservableMap, runInAction } from "mobx";

import { IWgSocketService, WgPeerState } from "../../socket";
import { IWgPeersLiveStore } from "./PeersLive.types";

const EMPTY_STATE: WgPeerState = { stats: null, status: null, active: null };

@IWgPeersLiveStore({ inSingleton: true })
export class WgPeersLiveStore implements IWgPeersLiveStore {
  peers: ObservableMap<string, WgPeerState> = observable.map(
    {},
    { deep: false },
  );

  private readonly _refCounts = new Map<string, number>();
  private readonly _unsubFns = new Map<string, () => void>();

  constructor(@IWgSocketService() private _wgSocket: IWgSocketService) {
    makeObservable(this, {}, { autoBind: true });
  }

  subscribe(peerId: string): void {
    const count = this._refCounts.get(peerId) ?? 0;

    this._refCounts.set(peerId, count + 1);

    if (count === 0) {
      this._startSubscription(peerId);
    }
  }

  unsubscribe(peerId: string): void {
    const count = this._refCounts.get(peerId) ?? 0;

    if (count <= 1) {
      this._refCounts.delete(peerId);
      this._unsubFns.get(peerId)?.();
      this._unsubFns.delete(peerId);
      runInAction(() => this.peers.delete(peerId));
    } else {
      this._refCounts.set(peerId, count - 1);
    }
  }

  private _merge(peerId: string, patch: Partial<WgPeerState>): void {
    this.peers.set(peerId, {
      ...(this.peers.get(peerId) ?? EMPTY_STATE),
      ...patch,
    });
  }

  private _startSubscription(peerId: string): void {
    const unsub = this._wgSocket.subscribePeer(peerId, {
      onStats: s => runInAction(() => this._merge(peerId, { stats: s })),
      onStatus: s => runInAction(() => this._merge(peerId, { status: s })),
      onActive: a => runInAction(() => this._merge(peerId, { active: a })),
    });

    this._unsubFns.set(peerId, unsub);
  }
}
