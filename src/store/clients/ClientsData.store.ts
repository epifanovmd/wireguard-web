import { DataHolder } from "@force-dev/utils";
import { ClientModel } from "@models";
import { IClient, IClientsService, IClientsSocketService } from "@service";
import { makeAutoObservable } from "mobx";

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

  async onRefresh() {
    this.holder.setLoading();
    const res = await this._clientsService.getClients();

    if (res.error) {
      this.holder.setError({ msg: res.error.toString() });
    } else if (res.data) {
      this.holder.setData(res.data);

      this.subscribeSocket();

      return res.data;
    }

    return [];
  }
}
