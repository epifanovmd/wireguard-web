import { iocHook } from "@di";

import { IUsersDataStore } from "../UsersData.types";

export const useUsersDataStore = iocHook(IUsersDataStore);
