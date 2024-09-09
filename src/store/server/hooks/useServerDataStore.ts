import { iocHook } from "@force-dev/react";

import { IServerDataStore } from "../ServerData.types";

export const useServerDataStore = iocHook(IServerDataStore);
