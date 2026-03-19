import { ApiResponse, createServiceDecorator, Maybe } from "@force-dev/utils";

import { ApiError } from "~@api";
import {
  IProfileUpdateRequestDto,
  ProfileDto,
  UserDto,
} from "~@api/api-gen/data-contracts";
import { ProfileModel } from "~@models";

import { EntityHolder, IEntityHolderResult, IHolderError } from "../holders";

export const IUserDataStore = createServiceDecorator<IUserDataStore>();

export interface IUserDataStore {
  readonly holder: EntityHolder<UserDto>;
  readonly user: UserDto | null;
  readonly profile: ProfileModel | undefined;
  readonly isLoading: boolean;
  readonly isError: boolean;

  load(): Promise<IEntityHolderResult<UserDto, IHolderError>>;
  refresh(): Promise<IEntityHolderResult<UserDto, IHolderError>>;
  updateProfile(
    data: IProfileUpdateRequestDto,
  ): Promise<ApiResponse<ProfileDto, ApiError>>;
  reset(): void;
}
