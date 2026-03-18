import { ListCollectionHolder } from "@force-dev/utils";
import { makeAutoObservable } from "mobx";

import { IApiService } from "~@api";
import {
  IWgServerCreateRequestDto,
  WgServerDto,
} from "~@api/api-gen/data-contracts";
import { ServerModel } from "~@models";

import { IServersListStore } from "./ServersListStore.types";

@IServersListStore({ inSingleton: true })
export class ServersListStore implements IServersListStore {
  public listHolder = new ListCollectionHolder<WgServerDto>();

  constructor(@IApiService() private _apiService: IApiService) {
    makeAutoObservable(this, {}, { autoBind: true });

    this.listHolder.initialize({
      keyExtractor: s => s.id,
      onFetchData: async () => {
        const res = await this._apiService.getServers({});
        const data = res.data?.data ?? [];

        this.listHolder.updateData(data, { replace: true });

        return data;
      },
      pageSize: 1000,
    });
  }

  get models() {
    return this.listHolder.d.map(s => new ServerModel(s));
  }

  get isLoading() {
    return this.listHolder.isLoading;
  }

  get total() {
    return this.listHolder.d.length;
  }

  async load() {
    await this.listHolder.performRefresh();
  }

  async createServer(params: IWgServerCreateRequestDto) {
    const res = await this._apiService.createServer(params);

    if (res.data) {
      this.addServer(res.data);
    }

    return res;
  }

  addServer(server: WgServerDto) {
    this.listHolder.updateData([...this.listHolder.d, server], {
      replace: true,
    });
  }

  removeServer(id: string) {
    this.listHolder.updateData(
      this.listHolder.d.filter(s => s.id !== id),
      { replace: true },
    );
  }

  updateServer(server: WgServerDto) {
    this.listHolder.updateData(
      this.listHolder.d.map(s => (s.id === server.id ? server : s)),
      { replace: true },
    );
  }
}
