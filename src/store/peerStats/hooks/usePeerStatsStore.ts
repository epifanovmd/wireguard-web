import { iocHook } from "@common/ioc";

import { IPeerStatsStore } from "../PeerStats.types";

export const usePeerStatsStore = iocHook(IPeerStatsStore);
