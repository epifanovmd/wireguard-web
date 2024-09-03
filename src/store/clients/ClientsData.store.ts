import { DataHolder } from "@force-dev/utils";
import { makeAutoObservable } from "mobx";

import { ClientModel } from "~@models";
import {
  IClient,
  IClientsService,
  IClientsSocketService,
  ICreateClient,
} from "~@service";

import { IClientsDataStore } from "./ClientsData.types";
import { ClientsIntervalDataSource } from "./ClientsIntervalData.source";

@IClientsDataStore()
export class ClientsDataStore implements IClientsDataStore {
  public holder = new DataHolder<IClient[]>([]);

  private _intervalDataSource = new ClientsIntervalDataSource(
    this._clientsService,
  );

  constructor(
    @IClientsService() private _clientsService: IClientsService,
    @IClientsSocketService()
    private _clientSocketService: IClientsSocketService,
  ) {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  get data() {
    return this.holder.d || [];
  }

  get models() {
    return this.data.map(item => new ClientModel(item));
  }

  get loading() {
    return this.holder.isLoading;
  }

  start() {
    const { unsubscribe } = this._intervalDataSource.subscribe(res => {
      this.holder.setData(res);
      unsubscribe();
    }, 1000);
  }

  subscribeSocket() {
    this._clientSocketService.subscribeAllClients(this.holder.setData);
  }

  unSubscribeSocket() {
    this._clientSocketService.unsubscribeAllClients();
  }

  async createClient(params: ICreateClient) {
    const client = await this._clientsService.createClient(params);

    if (client.data) {
      this.holder.setData([...this.data, client.data]);
    }
  }

  async deleteClient(clientId: string) {
    await this._clientsService.deleteClient(clientId);

    this.holder.setData(this.data.filter(item => item.id !== clientId));
  }

  async onRefresh() {
    this._clientSocketService.unsubscribeAllClients();
    this.holder.setLoading();
    const res = await this._clientsService.getClients();

    if (res.axiosError) {
      if (!res.isCanceled) {
        this.holder.setError({ msg: res.axiosError.toString() });
      }
    } else if (res.data) {
      this.holder.setData(res.data);

      this.subscribeSocket();

      return res.data;
    }

    return [];
  }
}
