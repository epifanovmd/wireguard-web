import { disposer, InitializeDispose } from "@force-dev/utils";
import { makeAutoObservable, reaction } from "mobx";

import { router } from "../../router";
import { ISocketTransport } from "../../socket";
import { IAuthStore } from "../auth";
import { IAppDataStore } from "./AppData.types";

@IAppDataStore({ inSingleton: true })
export class AppDataStore implements IAppDataStore {
  constructor(
    @IAuthStore() private _authStore: IAuthStore,
    @ISocketTransport() private _socketTransport: ISocketTransport,
  ) {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  initialize() {
    const disposers = new Set<InitializeDispose>();

    return [
      reaction(
        () => this._authStore.isAuthenticated,
        isAuthenticated => {
          if (isAuthenticated) {
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
