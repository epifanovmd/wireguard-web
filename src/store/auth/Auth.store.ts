import { createEnumModelBase } from "@force-dev/utils";
import { makeAutoObservable } from "mobx";

import { IApiService } from "~@api";
import {
  ISignInRequestDto,
  ITokensDto,
  IUserWithTokensDto,
  TSignUpRequestDto,
  UserDto,
} from "~@api/api-gen/data-contracts";

import { EntityHolder } from "../holders";
import { AuthStatus, IAuthStore } from "./Auth.types";

const AuthStatusModel = createEnumModelBase<typeof AuthStatus>(AuthStatus);

@IAuthStore({ inSingleton: true })
class AuthStore implements IAuthStore {
  private statusModel = new AuthStatusModel(() => this.status);
  public status = AuthStatus.Idle;

  private _userHolder = new EntityHolder<UserDto>();
  private _signHolder = new EntityHolder<
    IUserWithTokensDto,
    ISignInRequestDto
  >();
  private _signUpHolder = new EntityHolder<IUserWithTokensDto>();

  constructor(@IApiService() private _api: IApiService) {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  get user() {
    return this._userHolder.data;
  }

  get error() {
    return (
      this._signHolder.error?.message ??
      this._signUpHolder.error?.message ??
      null
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

  async signIn(params: ISignInRequestDto) {
    this._setStatus(AuthStatus.Loading);

    const res = await this._signHolder.fromApi(() => this._api.signIn(params));

    if (res.error) {
      this._setStatus(AuthStatus.Unauthenticated);

      return;
    }

    if (res.data) {
      const { tokens, ...userDto } = res.data;

      this._api.setTokens(tokens.accessToken, tokens.refreshToken);
      this._userHolder.setData(userDto);
      await this._loadUser();
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

      this._api.setTokens(tokens.accessToken, tokens.refreshToken);
      this._userHolder.setData(userDto);
      this._setStatus(AuthStatus.Authenticated);
    }
  }

  async restore(tokens?: ITokensDto) {
    this._setStatus(AuthStatus.Loading);

    if (tokens) {
      this._api.setTokens(tokens.accessToken, tokens.refreshToken);
    } else {
      const ok = await this._api.restoreTokens();

      if (!ok) {
        this._setStatus(AuthStatus.Unauthenticated);

        return;
      }
    }

    const { data } = await this._loadUser();

    this._setStatus(
      data ? AuthStatus.Authenticated : AuthStatus.Unauthenticated,
    );
  }

  signOut() {
    this._api.clearTokens();
    this._userHolder.reset();
    this._signHolder.reset();
    this._signUpHolder.reset();
    this._setStatus(AuthStatus.Unauthenticated);
  }

  private _loadUser() {
    return this._userHolder.fromApi(() => this._api.getMyUser());
  }

  private _setStatus(status: AuthStatus) {
    this.status = status;
  }
}
