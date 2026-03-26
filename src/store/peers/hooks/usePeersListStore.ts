import { iocHook } from "~@common/ioc";

import { IPeersListStore } from "../PeersListStore.types";

export const usePeersListStore = iocHook(IPeersListStore);
