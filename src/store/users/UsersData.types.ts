import { createServiceDecorator, DataHolder } from "@force-dev/utils";

import {
  IUserListDto,
  IUserPrivilegesRequestDto,
  IUserUpdateRequestDto,
  UserDto,
} from "~@api/api-gen/data-contracts";
import { PublicUserModel, UserModel } from "~@models";

export const IUsersDataStore = createServiceDecorator<IUsersDataStore>();

export interface IUsersDataStore {
  listHolder: DataHolder<IUserListDto>;
  userHolder: DataHolder<UserDto>;
  users: any[];
  models: PublicUserModel[];
  total: number;
  isLoading: boolean;
  user: UserDto | undefined;
  userModel: UserModel | undefined;
  offset: number;
  limit: number;
  setOffset(offset: number): void;
  loadUsers(): Promise<void>;
  loadUser(id: string): Promise<UserDto | undefined>;
  updateUser(id: string, params: IUserUpdateRequestDto): Promise<any>;
  setPrivileges(id: string, params: IUserPrivilegesRequestDto): Promise<any>;
  deleteUser(id: string): Promise<any>;
}
