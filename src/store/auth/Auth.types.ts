import { createServiceDecorator } from "@force-dev/utils";

import {
  IProfileUpdateRequestDto,
  ISignInRequestDto,
  ITokensDto,
  TSignUpRequestDto,
  UserDto,
} from "~@api/api-gen/data-contracts";
import { ProfileModel } from "~@models";

import { IEntityHolderResult, IHolderError } from "../holders";

export enum AuthStatus {
  Idle = "idle",
  Loading = "loading",
  Authenticated = "authenticated",
  Unauthenticated = "unauthenticated",
}

export const IAuthStore = createServiceDecorator<IAuthStore>();

export interface IAuthStore {
  readonly status: AuthStatus;
  readonly user: UserDto | null;
  readonly profile: ProfileModel | null;
  readonly error: string | undefined;
  readonly isIdle: boolean;
  readonly isAuthenticated: boolean;
  readonly isLoading: boolean;
  readonly isReady: boolean;

  load(): Promise<IEntityHolderResult<UserDto, IHolderError>>;
  signIn(params: ISignInRequestDto): Promise<void>;
  signUp(params: TSignUpRequestDto): Promise<void>;
  updateProfile(data: IProfileUpdateRequestDto): Promise<void>;
  restore(tokens?: ITokensDto): Promise<void>;
  signOut(): void;
}
