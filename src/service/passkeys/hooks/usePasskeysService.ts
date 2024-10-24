import { iocHook } from "@force-dev/react";

import { IPasskeysService } from "../Passkeys.types";

export const usePasskeysService = iocHook(IPasskeysService);
