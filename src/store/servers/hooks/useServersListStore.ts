import { iocHook } from "@force-dev/react";

import { IServersListStore } from "../ServersListStore.types";

export const useServersListStore = iocHook(IServersListStore);
