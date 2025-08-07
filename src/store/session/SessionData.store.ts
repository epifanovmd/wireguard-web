import { ApiResponse, DataHolder } from "@force-dev/utils";
import { notification } from "antd";
import { makeAutoObservable } from "mobx";

import { ApiError, IApiService, IApiTokenProvider } from "~@api";
import {
  IProfileWithTokensDto,
  ISignInRequest,
  ISignUpRequest,
  ITokensDto,
} from "~@api/api-gen/data-contracts";

import { IProfileDataStore } from "../profile";
import { ISessionDataStore } from "./SessionData.types";

@ISessionDataStore({ inSingleton: true })
export class SessionDataStore implements ISessionDataStore {
  private holder: DataHolder<string> = new DataHolder<string>();

  constructor(
    @IApiService() private _apiService: IApiService,
    @IProfileDataStore() private _profileDataStore: IProfileDataStore,
    @IApiTokenProvider() private _tokenProvider: IApiTokenProvider,
  ) {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  initialize() {
    return [];
  }

  get isLoading() {
    return this.holder.isLoading;
  }

  get isAuthorized() {
    return this.holder.isFilled;
  }

  get isReady() {
    return this.holder.isReady;
  }

  public async signIn(params: ISignInRequest) {
    this.holder.setLoading();

    const res = await this._apiService.signIn(params);

    this._handleResponse(res);
  }

  public async signUp(params: ISignUpRequest) {
    this.holder.setLoading();

    const res = await this._apiService.signUp(params);

    this._handleResponse(res);
  }

  async restore(tokens?: ITokensDto) {
    this.holder.setLoading();

    if (tokens) {
      this._tokenProvider.setTokens(tokens.accessToken, tokens.refreshToken);
      await this._profileDataStore.getProfile();
    } else {
      const refreshToken = await this._tokenProvider.restoreRefreshToken();

      if (refreshToken) {
        await this._apiService.updateToken();

        if (this._tokenProvider.accessToken) {
          await this._profileDataStore.getProfile();
          this.holder.setData(this._tokenProvider.accessToken);

          return;
        }
      }
    }
    this.holder.setPending();
  }

  public clear() {
    this.holder.clear();
    this._tokenProvider.clear();
    this._profileDataStore.holder.clear();
  }

  private _handleResponse(res: ApiResponse<IProfileWithTokensDto, ApiError>) {
    if (res.error) {
      this._tokenProvider.clear();
      this.holder.setError(res.error.message);

      notification.error({ message: res.error.message });
    } else if (res.data) {
      const { tokens, ...user } = res.data;

      this._profileDataStore.holder.setData(user);
      this._tokenProvider.setTokens(tokens.accessToken, tokens.refreshToken);
      this.holder.setData(this._tokenProvider.accessToken);
    }
  }
}
