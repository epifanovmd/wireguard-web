import { makeAutoObservable, reaction } from "mobx";

import { iocHook } from "../../common";
import { IAuthService, ISocketService } from "../../service";
import { ISessionDataStore } from "./SessionData.types";

export const useSessionDataStore = iocHook(ISessionDataStore);

@ISessionDataStore({ inSingleton: true })
export class SessionDataStore implements ISessionDataStore {
  private _token: string;

  constructor(
    @IAuthService() private _authService: IAuthService,
    @ISocketService() private _socketService: ISocketService,
  ) {
    this._token = this._authService.getLocalAccessToken();

    makeAutoObservable(this, {}, { autoBind: true });

    reaction(
      () => this.token,
      token => {
        console.log("access_token", token);
        if (!token) {
          this._socketService.disconnect();
        }
      },
    );
  }

  get token() {
    return this._token;
  }

  setToken(token?: string) {
    this._token = token ? String(token) : "";
  }

  clearToken() {
    this.setToken("");
  }
}
