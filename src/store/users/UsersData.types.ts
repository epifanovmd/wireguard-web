import { ApiError } from "@api";
import {
  IUserPrivilegesRequestDto,
  IUserUpdateRequestDto,
  PublicUserDto,
  UserDto,
} from "@api/api-gen/data-contracts";
import { ApiResponse } from "@api/api-gen/http-client";
import { createServiceDecorator } from "@common/ioc";
import {
  EntityHolder,
  IHolderError,
  IMutationHolderResult,
  MutationHolder,
  PagedHolder,
} from "@common/store";
import { PublicUserModel, UserModel } from "@models";

export const IUsersDataStore = createServiceDecorator<IUsersDataStore>();

export interface IUsersDataStore {
  listHolder: PagedHolder<PublicUserDto>;
  userHolder: EntityHolder<UserDto, string>;
  setPrivilegesMutation: MutationHolder<
    { id: string; params: IUserPrivilegesRequestDto },
    UserDto
  >;
  deleteUserMutation: MutationHolder<string, boolean>;
  models: PublicUserModel[];
  total: number;
  isLoading: boolean;
  user: UserDto | null;
  userModel: UserModel | null;

  load(): Promise<void>;
  loadUser(id: string): Promise<UserDto | null>;
  updateUser(
    id: string,
    params: IUserUpdateRequestDto,
  ): Promise<ApiResponse<UserDto, ApiError>>;
  setPrivileges(
    id: string,
    params: IUserPrivilegesRequestDto,
  ): Promise<IMutationHolderResult<UserDto>>;
  deleteUser(id: string): Promise<IMutationHolderResult<boolean>>;
}
