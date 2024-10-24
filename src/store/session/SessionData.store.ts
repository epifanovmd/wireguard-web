import { DataHolder, Interval } from "@force-dev/utils";
import { makeAutoObservable, reaction } from "mobx";

import { IApiService } from "~@api";
import { IRefreshTokenResponse, ITokenService } from "~@service";

import { IProfileDataStore } from "../profile";
import { ISessionDataStore } from "./SessionData.types";

@ISessionDataStore({ inSingleton: true })
export class SessionDataStore implements ISessionDataStore {
  private _interval = new Interval({ timeout: 60000 });
  private holder: DataHolder<string> = new DataHolder<string>();

  constructor(
    @IApiService() private _apiService: IApiService,
    @IProfileDataStore() private _profileDataStore: IProfileDataStore,
    @ITokenService() private _tokenService: ITokenService,
  ) {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  initialize(authRedirect: () => void) {
    this._apiService.onError(async ({ status }) => {
      if (status === 401) {
        authRedirect();
      }

      if (status === 403) {
        await this._profileDataStore.updateToken();
      }
    });

    return [
      reaction(
        () => this._profileDataStore.profile,
        profile => {
          if (profile) {
            this._interval.start(async () => {
              await this._profileDataStore.updateToken();
            });
          } else {
            this._interval.stop();
          }
        },
      ),
      reaction(() => this._tokenService.accessToken, this.holder.setData),
      () => this._interval.stop(),
    ];
  }

  get isAuthorized() {
    return this.holder.isFilled;
  }

  get isReady() {
    return this.holder.isReady;
  }

  async restore(tokens?: IRefreshTokenResponse) {
    if (tokens) {
      this._tokenService.setTokens(tokens.accessToken, tokens.refreshToken);
      await this._profileDataStore.getProfile();

      return tokens.accessToken;
    } else {
      this.holder.setLoading();

      const { accessToken } = await this._profileDataStore.updateToken();

      await this._profileDataStore.getProfile();

      this.holder.setData(accessToken);

      return accessToken;
    }
  }
}
