import { iocHook } from "~@common/ioc";

import { IPeerDataStore } from "../PeerDataStore.types";

export const usePeerDataStore = iocHook(IPeerDataStore);
