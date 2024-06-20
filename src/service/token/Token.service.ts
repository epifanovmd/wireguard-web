import { makeAutoObservable, reaction } from "mobx";

import { IApiService } from "../../api";
import { ITokenService } from "./Token.types";

@ITokenService({ inSingleton: true })
export class TokenService implements ITokenService {
  public accessToken: string = "";
  public refreshToken: string = "";

  constructor(@IApiService() private _apiService: IApiService) {
    this.restoreRefreshToken().then();

    makeAutoObservable(this, {}, { autoBind: true });

    reaction(() => this.accessToken, _apiService.setToken, {
      fireImmediately: true,
    });
  }

  setTokens(accessToken: string, refreshToken: string) {
    this.accessToken = accessToken;

    if (refreshToken) {
      localStorage.setItem("refresh_token", refreshToken);
    } else {
      this.clear();
    }
    this.refreshToken = refreshToken;
  }

  async restoreRefreshToken() {
    const token = await new Promise<string | null>(resolve =>
      resolve(localStorage.getItem("refresh_token")),
    ).then(res => res ?? "");

    this.setTokens(this.accessToken, token);

    return token;
  }

  clear() {
    this.accessToken = "";

    localStorage.removeItem("refresh_token");
    this.refreshToken = "";
  }
}
