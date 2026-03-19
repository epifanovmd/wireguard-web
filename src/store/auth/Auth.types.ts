import { createServiceDecorator } from "@force-dev/utils";

import {
  ISignInRequestDto,
  ITokensDto,
  TSignUpRequestDto,
  UserDto,
} from "~@api/api-gen/data-contracts";

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
  readonly error: string | null;
  readonly isIdle: boolean;
  readonly isAuthenticated: boolean;
  readonly isLoading: boolean;
  readonly isReady: boolean;

  signIn(params: ISignInRequestDto): Promise<void>;
  signUp(params: TSignUpRequestDto): Promise<void>;
  restore(tokens?: ITokensDto): Promise<void>;
  signOut(): void;
}
