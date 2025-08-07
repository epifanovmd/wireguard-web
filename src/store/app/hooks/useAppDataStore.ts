import { iocHook } from "@force-dev/react";

import { IAppDataStore } from "../AppData.types";

export const useAppDataStore = iocHook(IAppDataStore);
