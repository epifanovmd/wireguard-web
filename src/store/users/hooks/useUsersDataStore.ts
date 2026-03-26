import { iocHook } from "~@common/ioc";

import { IUsersDataStore } from "../UsersData.types";

export const useUsersDataStore = iocHook(IUsersDataStore);
