import { iocHook } from "@force-dev/react";
import { makeAutoObservable, reaction } from "mobx";

import { IApiService } from "../../api";
import { ITokenService } from "./Token.types";

export const useTokenService = iocHook(ITokenService);

@ITokenService({ inSingleton: true })
export class TokenService implements ITokenService {
  accessToken: string = "";
  refreshToken: string = "";

  constructor(@IApiService() private _apiService: IApiService) {
    this.getRefreshToken().then();

    makeAutoObservable(this, {}, { autoBind: true });

    reaction(
      () => this.accessToken,
      token => {
        // console.log("token", token);
        _apiService.setToken(token);
      },
      {
        fireImmediately: true,
      },
    );
  }

  setTokens(accessToken: string, refreshToken: string) {
    this.accessToken = accessToken;

    localStorage.setItem("refresh_token", refreshToken);
    this.refreshToken = refreshToken;
  }

  async getRefreshToken() {
    const refreshToken = localStorage.getItem("refresh_token");
    const token = refreshToken || "";

    this.setTokens(this.accessToken, token);

    return token;
  }

  clear() {
    this.accessToken = "";

    localStorage.removeItem("refresh_token");
    this.refreshToken = "";
  }
}
