import { makeAutoObservable, reaction } from "mobx";

import {
  AuthService,
  IAuthService,
  ISocketService,
  SocketService,
} from "../../service";
import { ISessionDataStore } from "./SessionData.types";

@ISessionDataStore({ inSingleton: true })
export class SessionDataStore implements ISessionDataStore {
  private _token: string;

  constructor(
    @IAuthService() private _authService: AuthService,
    @ISocketService() private _socketService: SocketService,
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
