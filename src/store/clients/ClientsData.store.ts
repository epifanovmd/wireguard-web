import { DataHolder } from "@force-dev/utils";
import { makeAutoObservable } from "mobx";

import { ClientModel } from "~@models";
import {
  IClient,
  IClientsService,
  IClientsSocketService,
  ICreateClientRequest,
  IUpdateClientRequest,
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

  subscribeSocket(clientId: string[]) {
    this._clientSocketService.subscribeClient(clientId, data => {
      this.holder.setData(
        this.data.map(item => {
          const dataItem = data[item.id];

          if (dataItem) {
            return {
              ...item,
              ...dataItem,
            };
          }

          return item;
        }),
      );
    });
  }

  unSubscribeSocket() {
    this._clientSocketService.unsubscribeClient();
  }

  async updateClient(clientId: string, params: IUpdateClientRequest) {
    const client = await this._clientsService.updateClient(clientId, params);

    if (client.data) {
      const clientData = client.data;

      this.holder.setData(
        this.data.map(item => (item.id === clientData.id ? clientData : item)),
      );
    }
  }

  async createClient(params: ICreateClientRequest) {
    const client = await this._clientsService.createClient(params);

    if (client.data) {
      this.holder.setData([...this.data, client.data]);
    }
  }

  async deleteClient(clientId: string) {
    await this._clientsService.deleteClient(clientId);

    this.holder.setData(this.data.filter(item => item.id !== clientId));
  }

  async onRefresh(serverId: string) {
    this._clientSocketService.unsubscribeClient();
    this.holder.setLoading();
    const res = await this._clientsService.getClients(serverId);

    if (res.axiosError) {
      if (!res.isCanceled) {
        this.holder.setError({ msg: res.axiosError.toString() });
      }
    } else if (res.data) {
      this.holder.setData(res.data.data);

      this.subscribeSocket(res.data.data.map(item => item.id));

      return res.data.data;
    }

    return [];
  }
}
