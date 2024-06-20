import { iocHook } from "@force-dev/react";

import { IProfileDataStore } from "../ProfileData.types";

export const useProfileDataStore = iocHook(IProfileDataStore);
