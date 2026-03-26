import { iocHook } from "~@common/ioc";

import { IServersListStore } from "../ServersListStore.types";

export const useServersListStore = iocHook(IServersListStore);
