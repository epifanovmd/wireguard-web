import { iocHook } from "@di";

import { IAppDataStore } from "../AppData.types";

export const useAppDataStore = iocHook(IAppDataStore);
