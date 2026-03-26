import { IApiService } from "@api";
import {
  IWgServerCreateRequestDto,
  WgServerDto,
} from "@api/api-gen/data-contracts";
import { ServerModel } from "@models";
import { MutationHolder, PagedHolder } from "@store";
import { makeAutoObservable } from "mobx";

import { IServersListStore } from "./ServersListStore.types";

@IServersListStore({ inSingleton: true })
export class ServersListStore implements IServersListStore {
  public listHolder = new PagedHolder<WgServerDto>({
    keyExtractor: s => s.id,
    onFetch: async pagination => this._apiService.getServers(pagination),
    pageSize: 1000,
  });
  public createServerMutation = new MutationHolder<
    IWgServerCreateRequestDto,
    WgServerDto
  >({
    onMutate: async args => {
      const res = await this._apiService.createServer(args);

      if (res.data) {
        this.addServer(res.data);
      }

      return res;
    },
  });
  public deleteServerMutation = new MutationHolder<string, boolean>({
    onMutate: async id => {
      const res = await this._apiService.deleteServer({ id });

      if (res.data) {
        this.removeServer(id);
      }

      return res;
    },
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
    return this.createServerMutation.execute(params);
  }

  async deleteServer(id: string) {
    return this.deleteServerMutation.execute(id);
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
