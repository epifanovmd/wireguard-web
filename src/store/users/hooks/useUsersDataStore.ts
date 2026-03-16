import { iocHook } from "@force-dev/react";

import { IUsersDataStore } from "../UsersData.types";

export const useUsersDataStore = iocHook(IUsersDataStore);
