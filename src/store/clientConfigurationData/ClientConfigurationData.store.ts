import { AsyncDataSource } from "@force-dev/utils";
import { makeAutoObservable } from "mobx";

import { IClientsService } from "~@service";

import { IClientConfigurationDataDataStore } from "./ClientConfigurationData.types";

@IClientConfigurationDataDataStore()
export class ClientConfigurationDataStore
  implements IClientConfigurationDataDataStore
{
  public holder = new AsyncDataSource<string, string>(clientId =>
    this._clientsService.getClientConfiguration(clientId),
  );

  constructor(@IClientsService() private _clientsService: IClientsService) {
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
