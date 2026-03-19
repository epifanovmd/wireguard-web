import { disposer, InitializeDispose } from "@force-dev/utils";
import { makeAutoObservable, reaction } from "mobx";

import { router } from "../../router";
import { ISocketTransport } from "../../socket";
import { ISessionDataStore } from "../session";
import { IAppDataStore } from "./AppData.types";

@IAppDataStore({ inSingleton: true })
export class AppDataStore implements IAppDataStore {
  constructor(
    @ISessionDataStore() public sessionDataStore: ISessionDataStore,
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
          } else {
            disposer(Array.from(disposers));
            disposers.clear();

            router.navigate({ to: "/auth/signIn" });
          }
        },
      ),
      () => {
        disposer(Array.from(disposers));
        disposers.clear();
      },
    ];
  }
}
