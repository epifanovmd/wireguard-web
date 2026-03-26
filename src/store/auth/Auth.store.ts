import { computed, makeAutoObservable } from "mobx";

import { IApiService } from "~@api";
import {
  EPermissions,
  ERole,
  IProfileUpdateRequestDto,
  ISignInRequestDto,
  ITokensDto,
  IUserWithTokensDto,
  TSignUpRequestDto,
  UserDto,
} from "~@api/api-gen/data-contracts";
import { createEnumModelBase } from "~@common/store/models";
import { IAuthSessionService } from "~@core/auth";
import { EntityHolder } from "~@core/holders";
import {
  canAccess,
  computeEffectivePermissions,
  isAdminRole,
} from "~@core/permissions";
import { ProfileModel } from "~@models";

import { AuthStatus, IAuthStore } from "./Auth.types";

const AuthStatusModel = createEnumModelBase<typeof AuthStatus>(AuthStatus);

@IAuthStore({ inSingleton: true })
class AuthStore implements IAuthStore {
  private statusModel = new AuthStatusModel(() => this.status);
  public status = AuthStatus.Idle;

  private _userHolder = new EntityHolder<UserDto>({
    onFetch: () => this._api.getMyUser(),
  });
  private _signHolder = new EntityHolder<
    IUserWithTokensDto,
    ISignInRequestDto
  >();
  private _signUpHolder = new EntityHolder<IUserWithTokensDto>();

  constructor(
    @IApiService() private _api: IApiService,
    @IAuthSessionService() private _session: IAuthSessionService,
  ) {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  get user() {
    return this._userHolder.data;
  }

  get roles(): ERole[] {
    return this.user?.roles.map(r => r.name) ?? [];
  }

  get directPermissions(): EPermissions[] {
    return this.user?.directPermissions.map(p => p.name) ?? [];
  }

  get permissions(): EPermissions[] {
    const rolePerms =
      this.user?.roles.flatMap(r => r.permissions.map(p => p.name)) ?? [];

    return computeEffectivePermissions(rolePerms, this.directPermissions);
  }

  get isAdmin(): boolean {
    return isAdminRole(this.roles);
  }

  hasPermission(required: EPermissions): boolean {
    return canAccess(this.roles, this.permissions, required);
  }

  get profile() {
    return this.user?.profile
      ? new ProfileModel({
          user: this.user,
          ...this.user.profile,
        })
      : null;
  }

  get error() {
    return (
      this._signHolder.error?.message ??
      this._signUpHolder.error?.message ??
      this._userHolder.error?.message
    );
  }

  get isIdle() {
    return this.statusModel.isIdle;
  }

  get isAuthenticated() {
    return this.statusModel.isAuthenticated;
  }

  get isLoading() {
    return this.statusModel.isLoading;
  }

  get isReady() {
    return !this.isIdle && !this.isLoading;
  }

  public load() {
    if (this.user) {
      return this._userHolder.refresh();
    }

    return this._userHolder.load();
  }

  async signIn(params: ISignInRequestDto) {
    this._setStatus(AuthStatus.Loading);

    const res = await this._signHolder.fromApi(() => this._api.signIn(params));

    if (res.error) {
      this._setStatus(AuthStatus.Unauthenticated);

      return;
    }

    if (res.data) {
      const { tokens, ...userDto } = res.data;

      this._session.setTokens(tokens.accessToken, tokens.refreshToken);
      this._userHolder.setData(userDto);
      await this.load();
      this._setStatus(AuthStatus.Authenticated);
    }
  }

  async signUp(params: TSignUpRequestDto) {
    this._setStatus(AuthStatus.Loading);

    const res = await this._signUpHolder.fromApi(() =>
      this._api.signUp(params),
    );

    if (res.error) {
      this._setStatus(AuthStatus.Unauthenticated);

      return;
    }

    if (res.data) {
      const { tokens, ...userDto } = res.data;

      this._session.setTokens(tokens.accessToken, tokens.refreshToken);
      this._userHolder.setData(userDto);
      this._setStatus(AuthStatus.Authenticated);
    }
  }

  async updateProfile(data: IProfileUpdateRequestDto) {
    const res = await this._api.updateMyProfile(data);
    const user = this._userHolder.data;

    if (res.data && user) {
      this._userHolder.setData({ ...user, profile: res.data });
    }
  }

  async restore(tokens?: ITokensDto) {
    this._setStatus(AuthStatus.Loading);

    if (tokens) {
      this._session.setTokens(tokens.accessToken, tokens.refreshToken);
    } else {
      const ok = await this._session.restoreSession();

      if (!ok) {
        this._setStatus(AuthStatus.Unauthenticated);

        return;
      }
    }

    const { data } = await this.load();

    this._setStatus(
      data ? AuthStatus.Authenticated : AuthStatus.Unauthenticated,
    );
  }

  signOut() {
    this._session.clearTokens();
    this._userHolder.reset();
    this._signHolder.reset();
    this._signUpHolder.reset();
    this._setStatus(AuthStatus.Unauthenticated);
  }

  private _setStatus(status: AuthStatus) {
    this.status = status;
  }
}
