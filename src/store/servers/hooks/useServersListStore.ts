import { iocHook } from "@di";

import { IServersListStore } from "../ServersListStore.types";

export const useServersListStore = iocHook(IServersListStore);
