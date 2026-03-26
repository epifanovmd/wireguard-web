import { iocHook } from "@di";

import { IPeersListStore } from "../PeersListStore.types";

export const usePeersListStore = iocHook(IPeersListStore);
