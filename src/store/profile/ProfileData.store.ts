import { ApiResponse, DataHolder } from "@force-dev/utils";
import { makeAutoObservable } from "mobx";

import {
  IProfile,
  IProfileService,
  ISignInRequest,
  ISignInResponse,
  ITokenService,
} from "~@service";

import { IProfileDataStore } from "./ProfileData.types";

@IProfileDataStore({ inSingleton: true })
export class ProfileDataStore implements IProfileDataStore {
  public holder = new DataHolder<IProfile>();

  constructor(
    @IProfileService() private _profileService: IProfileService,
    @ITokenService() private _tokenService: ITokenService,
  ) {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  updateToken() {
    return this._tokenService.restoreRefreshToken().then(async refreshToken => {
      if (refreshToken) {
        await this._refresh(refreshToken);
      }

      return {
        accessToken: this._tokenService.accessToken,
        refreshToken: this._tokenService.refreshToken,
      };
    });
  }

  get profile() {
    return this.holder.d;
  }

  get isLoading() {
    return this.holder.isLoading;
  }

  get isError() {
    return this.holder.isError;
  }

  get isEmpty() {
    return this.holder.isEmpty;
  }

  async signIn(params: ISignInRequest) {
    this.holder.setLoading();

    const res = await this._profileService.signIn(params);

    this._updateProfileHolder(res);
  }

  // async signUp(params: ISignUpRequest) {
  //   this.holder.setLoading();
  //
  //   const res = await this._profileService.signUp(params);
  //
  //   this._updateProfileHolder(res);
  // }

  private async _refresh(refreshToken: string) {
    const res = await this._profileService.refresh({ refreshToken });

    if (res.error) {
      this._tokenService.clear();
    } else if (res.data) {
      this._tokenService.setTokens(res.data.accessToken, res.data.refreshToken);
    }
  }

  private _updateProfileHolder(res: ApiResponse<ISignInResponse>) {
    if (res.error) {
      this._tokenService.clear();
      this.holder.setError({ msg: res.error.message });
    } else if (res.data) {
      this.holder.setData(res.data);
      this._tokenService.setTokens(
        res.data.tokens.accessToken,
        res.data.tokens.refreshToken,
      );
    }
  }
}
