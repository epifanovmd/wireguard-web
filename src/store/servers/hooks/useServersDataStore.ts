import { iocHook } from "@force-dev/react";

import { IServersDataStore } from "../ServersData.types";

export const useServersDataStore = iocHook(IServersDataStore);
