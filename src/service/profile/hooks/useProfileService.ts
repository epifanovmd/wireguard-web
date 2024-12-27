import { iocHook } from "@force-dev/react";

import { IProfileService } from "../Profile.types";

export const useProfileService = iocHook(IProfileService);
