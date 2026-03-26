import {
  EPermissions,
  ERole,
  IProfileUpdateRequestDto,
  ISignInRequestDto,
  ITokensDto,
  TSignUpRequestDto,
  UserDto,
} from "@api/api-gen/data-contracts";
import { createServiceDecorator } from "@common/ioc";
import { IEntityHolderResult, IHolderError } from "@common/store";
import { ProfileModel } from "@models";

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

  /** Роли текущего пользователя */
  readonly roles: ERole[];
  /** Прямые права текущего пользователя */
  readonly directPermissions: EPermissions[];
  /** Effective permissions = union(role permissions) + directPermissions */
  readonly permissions: EPermissions[];
  /** true если у пользователя роль ADMIN (superadmin bypass) */
  readonly isAdmin: boolean;

  /** Проверяет право с wildcard-иерархией (admin всегда true) */
  hasPermission(required: EPermissions): boolean;

  load(): Promise<IEntityHolderResult<UserDto, IHolderError>>;
  signIn(params: ISignInRequestDto): Promise<void>;
  signUp(params: TSignUpRequestDto): Promise<void>;
  updateProfile(data: IProfileUpdateRequestDto): Promise<void>;
  restore(tokens?: ITokensDto): Promise<void>;
  signOut(): void;
}
