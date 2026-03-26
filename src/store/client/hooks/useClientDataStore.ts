import { iocHook } from "~@common/ioc";

import { IClientDataStore } from "../ClientData.types";

export const useClientDataStore = iocHook(IClientDataStore);
