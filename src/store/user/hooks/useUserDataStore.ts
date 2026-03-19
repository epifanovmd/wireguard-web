import { iocHook } from "@force-dev/react";

import { IUserDataStore } from "../UserData.types";

export const useUserDataStore = iocHook(IUserDataStore);
