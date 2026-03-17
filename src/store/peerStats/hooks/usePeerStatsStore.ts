import { iocHook } from "@force-dev/react";

import { IPeerStatsStore } from "../PeerStats.types";

export const usePeerStatsStore = iocHook(IPeerStatsStore);
