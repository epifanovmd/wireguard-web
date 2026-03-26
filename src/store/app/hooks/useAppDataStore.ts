import { iocHook } from "~@common/ioc";

import { IAppDataStore } from "../AppData.types";

export const useAppDataStore = iocHook(IAppDataStore);
