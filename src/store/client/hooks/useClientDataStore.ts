import { iocHook } from "@force-dev/react";

import { IClientDataStore } from "../ClientData.types";

export const useClientDataStore = iocHook(IClientDataStore);
