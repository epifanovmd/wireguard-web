import { createServiceDecorator, DataHolder, ListCollectionHolder } from "@force-dev/utils";

import {
  IUserPrivilegesRequestDto,
  IUserUpdateRequestDto,
  PublicUserDto,
  UserDto,
} from "~@api/api-gen/data-contracts";
import { PublicUserModel, UserModel } from "~@models";

export const IUsersDataStore = createServiceDecorator<IUsersDataStore>();

export interface IUsersDataStore {
  listHolder: ListCollectionHolder<PublicUserDto>;
  userHolder: DataHolder<UserDto>;
  models: PublicUserModel[];
  total: number;
  isLoading: boolean;
  user: UserDto | undefined;
  userModel: UserModel | undefined;

  load(pageOffset?: number): Promise<void>;
  loadUser(id: string): Promise<UserDto | undefined>;
  updateUser(id: string, params: IUserUpdateRequestDto): Promise<any>;
  setPrivileges(id: string, params: IUserPrivilegesRequestDto): Promise<any>;
  deleteUser(id: string): Promise<any>;
}
