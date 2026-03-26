import { iocHook } from "@di";

import { IClientDataStore } from "../ClientData.types";

export const useClientDataStore = iocHook(IClientDataStore);
