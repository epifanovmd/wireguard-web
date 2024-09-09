import { DataHolder } from "@force-dev/utils";
import { makeAutoObservable } from "mobx";

import { ClientModel } from "~@models";
import { IClient, IClientsService, IClientsSocketService } from "~@service";

import { IClientDataStore } from "./ClientData.types";

@IClientDataStore()
export class ClientDataStore implements IClientDataStore {
  public holder = new DataHolder<IClient>();

  constructor(
    @IClientsService() private _clientsService: IClientsService,
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
        const dataItem = data[this.data.id];

        this.holder.setData(
          dataItem ? { ...this.data, ...dataItem } : this.data,
        );
      }
    });
  }

  unSubscribeSocket() {
    this._clientSocketService.unsubscribeClient();
  }

  async onRefresh(clientId: string) {
    this.unSubscribeSocket();
    this.holder.setLoading();
    const res = await this._clientsService.getClient(clientId);

    if (res.axiosError) {
      if (!res.isCanceled) {
        this.holder.setError({ msg: res.axiosError.toString() });
      }
    } else if (res.data) {
      this.holder.setData(res.data);

      this._clientSocketService.subscribeClient([res.data.id]);

      return res.data;
    }

    return undefined;
  }
}
