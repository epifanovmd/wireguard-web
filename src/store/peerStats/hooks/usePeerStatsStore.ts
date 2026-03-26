import { iocHook } from "@di";

import { IPeerStatsStore } from "../PeerStats.types";

export const usePeerStatsStore = iocHook(IPeerStatsStore);
