import { disposer, InitializeDispose, Interval } from "@force-dev/utils";
import { makeAutoObservable, reaction } from "mobx";

import { IApiService } from "~@api";
import { ISocketService } from "~@service";

import { router } from "../../index";
import { ISessionDataStore } from "../session";
import { IAppDataStore } from "./AppData.types";

@IAppDataStore()
export class AppDataStore implements IAppDataStore {
  private _interval = new Interval({ timeout: 20000 });

  constructor(
    @ISessionDataStore() public sessionDataStore: ISessionDataStore,
    @IApiService() private _apiService: IApiService,
    @ISocketService() private _socketService: ISocketService,
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
            disposers.add(this._socketService.initialize());

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
