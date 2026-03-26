import { ObservableMap } from "mobx";

import { createServiceDecorator } from "~@common/ioc";

import { WgPeerState } from "../../socket";

export const IWgPeersLiveStore =
  createServiceDecorator<IWgPeersLiveStore>();

export interface IWgPeersLiveStore {
  peers: ObservableMap<string, WgPeerState>;
  subscribe(peerId: string): void;
  unsubscribe(peerId: string): void;
}
