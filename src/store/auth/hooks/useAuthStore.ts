import { iocHook } from "@di";

import { IAuthStore } from "../Auth.types";

export const useAuthStore = iocHook(IAuthStore);
