import { disposer, InitializeDispose, Interval } from "@force-dev/utils";
import { makeAutoObservable, reaction } from "mobx";

import { IApiService } from "~@api";

import { router } from "../../router";
import { ISocketTransport } from "../../socket";
import { ISessionDataStore } from "../session";
import { IAppDataStore } from "./AppData.types";

@IAppDataStore()
export class AppDataStore implements IAppDataStore {
  private _interval = new Interval({ timeout: 20000 });

  constructor(
    @ISessionDataStore() public sessionDataStore: ISessionDataStore,
    @IApiService() private _apiService: IApiService,
    @ISocketTransport() private _socketTransport: ISocketTransport,
  ) {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  initialize() {
    const disposers = new Set<InitializeDispose>();

    return [
      reaction(
        () => this.sessionDataStore.isAuthorized,
        isAuthorized => {
          if (isAuthorized) {
            disposers.add(this._socketTransport.initialize());

            this._interval.start(async () => {
              await this._apiService.updateToken();
            });
          } else {
            this._interval.stop();

            disposer(Array.from(disposers));
            disposers.clear();

            router.navigate({ to: "/auth/signIn" });
          }
        },
      ),
      () => this._interval.stop(),
      () => {
        disposer(Array.from(disposers));
        disposers.clear();
      },
    ];
  }
}
