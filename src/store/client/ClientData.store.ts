import { DataHolder } from "@force-dev/utils";
import { makeAutoObservable } from "mobx";

import { IApiService } from "~@api";
import { IWgClientsDto } from "~@api/api-gen/data-contracts";
import { ClientModel } from "~@models";
import { IClientsSocketService } from "~@service";

import { IClientDataStore } from "./ClientData.types";

@IClientDataStore()
export class ClientDataStore implements IClientDataStore {
  public holder = new DataHolder<IWgClientsDto>();

  constructor(
    @IApiService() private _apiService: IApiService,
    @IClientsSocketService()
    private _clientSocketService: IClientsSocketService,
  ) {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  get data() {
    return this.holder.d;
  }

  get model() {
    return this.data ? new ClientModel(this.data) : undefined;
  }

  get loading() {
    return this.holder.isLoading;
  }

  subscribeSocket(clientId: string[]) {
    this._clientSocketService.subscribeClient(clientId, data => {
      if (this.data) {
        const dataItem = data[this.data.id!];

        this.holder.setData(
          dataItem ? { ...this.data, ...dataItem } : this.data,
        );
      }
    });
  }

  unsubscribeSocket() {
    this._clientSocketService.unsubscribeClient();
  }

  async onRefresh(clientId: string) {
    this.unsubscribeSocket();
    this.holder.setLoading();
    const res = await this._apiService.getWgClient(clientId);

    if (res.axiosError) {
      if (!res.isCanceled) {
        this.holder.setError(res.axiosError.toString());
      }
    } else if (res.data) {
      this.holder.setData(res.data);

      this._clientSocketService.subscribeClient([res.data.id!]);

      return res.data;
    }

    return undefined;
  }
}
