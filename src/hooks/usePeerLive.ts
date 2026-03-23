import { useEffect } from "react";

import { WgPeerState } from "../socket";
import { useWgPeersLiveStore } from "../store/peersLive";

const EMPTY: WgPeerState = { stats: null, status: null, active: null };

export const usePeerLive = (peerId: string): WgPeerState => {
  const store = useWgPeersLiveStore();

  useEffect(() => {
    store.subscribe(peerId);

    return () => store.unsubscribe(peerId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [peerId]);

  return store.peers.get(peerId) ?? EMPTY;
};
