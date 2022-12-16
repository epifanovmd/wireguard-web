import { inject, injectable } from "inversify";
import Cookie from "js-cookie";
import { makeAutoObservable, reaction } from "mobx";

import { AuthService, SocketService } from "../../service";

@injectable()
export class SessionDataStore {
  private _token: string;

  constructor(
    @inject(AuthService) private _authService: AuthService,
    @inject(SocketService) private _socketService: SocketService,
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
