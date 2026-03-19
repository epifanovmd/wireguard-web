import { iocHook } from "@force-dev/react";

import { IAuthStore } from "../Auth.types";

export const useAuthStore = iocHook(IAuthStore);
