import { createServiceDecorator } from "@di";
import { ObservableMap } from "mobx";

import { WgPeerState } from "../../socket";

export const IWgPeersLiveStore = createServiceDecorator<IWgPeersLiveStore>();

export interface IWgPeersLiveStore {
  peers: ObservableMap<string, WgPeerState>;
  subscribe(peerId: string): void;
  unsubscribe(peerId: string): void;
}
