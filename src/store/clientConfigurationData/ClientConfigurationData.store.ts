import { AsyncDataSource } from "@force-dev/utils";
import { makeAutoObservable } from "mobx";

import { IApiService } from "~@api";

import { IClientConfigurationDataDataStore } from "./ClientConfigurationData.types";

@IClientConfigurationDataDataStore()
export class ClientConfigurationDataStore
  implements IClientConfigurationDataDataStore
{
  public holder = new AsyncDataSource<string, string>(clientId =>
    this._apiService.getWgClientConfiguration(clientId),
  );

  constructor(@IApiService() private _apiService: IApiService) {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  get data() {
    return this.holder.d;
  }

  get loading() {
    return this.holder.isLoading;
  }

  async onRefresh(clientId: string) {
    return this.holder.refresh(clientId);
  }
}
