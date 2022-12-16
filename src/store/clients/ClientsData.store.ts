import { inject, injectable } from "inversify";
import { makeAutoObservable } from "mobx";

import { CollectionHolder } from "../../common";
import { ClientModel } from "../../models";
import { ClientsService, ClientsSocketService, IClient } from "../../service";
import { ClientsIntervalDataSource } from "./ClientsIntervalData.source";

@injectable()
export class ClientsDataStore {
  public holder: CollectionHolder<IClient> = new CollectionHolder([]);

  private _intervalDataSource = new ClientsIntervalDataSource(
    this._clientsService,
  );

  constructor(
    @inject(ClientsService) private _clientsService: ClientsService,
    @inject(ClientsSocketService)
    private _clientSocketService: ClientsSocketService,
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

    this._intervalDataSource.setParams({ name: "string" });
  }

  subscribeSocket() {
    this._clientSocketService.subscribeAllClients(this.holder.setData);
  }

  async onRefresh() {
    this.holder.setLoading(false);
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