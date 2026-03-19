import { makeAutoObservable } from "mobx";

import { IApiService } from "~@api";
import {
  IWgServerCreateRequestDto,
  WgServerDto,
} from "~@api/api-gen/data-contracts";
import { ServerModel } from "~@models";

import { PagedHolder } from "../holders";
import { IServersListStore } from "./ServersListStore.types";

@IServersListStore({ inSingleton: true })
export class ServersListStore implements IServersListStore {
  public listHolder = new PagedHolder<WgServerDto>({
    keyExtractor: s => s.id,
    onFetch: async pagination => this._apiService.getServers(pagination),
    pageSize: 1000,
  });

  constructor(@IApiService() private _apiService: IApiService) {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  get models() {
    return this.listHolder.items.map(s => new ServerModel(s));
  }

  get isLoading() {
    return this.listHolder.isLoading;
  }

  get total() {
    return this.listHolder.pagination.totalCount;
  }

  get pageCount() {
    return this.listHolder.pageCount;
  }

  async load() {
    await this.listHolder.load();
  }

  async createServer(params: IWgServerCreateRequestDto) {
    const res = await this._apiService.createServer(params);

    if (res.data) {
      this.addServer(res.data);
    }

    return res;
  }

  addServer(server: WgServerDto) {
    this.listHolder.appendItem(server);
  }

  removeServer(id: string) {
    this.listHolder.removeItem(id);
  }

  updateServer(server: WgServerDto) {
    this.listHolder.updateItem(server.id, server);
  }
}
