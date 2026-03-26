import { iocHook } from "@common/ioc";

import { IAuthStore } from "../Auth.types";

export const useAuthStore = iocHook(IAuthStore);
