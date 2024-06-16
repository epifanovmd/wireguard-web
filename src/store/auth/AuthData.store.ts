import { makeAutoObservable } from "mobx";

import { DataHolder, iocHook, Maybe } from "../../common";
import { IAuthService, ILoginRequest, IProfile } from "../../service";
import { IAuthDataStore } from "./AuthData.types";

export const useAuthDataStore = iocHook(IAuthDataStore);

@IAuthDataStore()
class AuthDataStore implements IAuthDataStore {
  public holder = new DataHolder<Maybe<IProfile>>(undefined);

  constructor(@IAuthService() private _authService: IAuthService) {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  public get data() {
    return this.holder.d;
  }

  public async login(params: ILoginRequest) {
    this.holder.setLoading();

    const res = await this._authService.login(params);

    if (res.error) {
      this.holder.setError({ msg: res.error.toString() });
    } else {
      this.holder.setData(res.data);

      return res.data;
    }

    return undefined;
  }
}
