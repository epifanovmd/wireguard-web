import { makeAutoObservable } from "mobx";

import { IApiService } from "~@api";
import {
  IWgServerCreateRequestDto,
  IWgServerStatusDto,
  IWgServerUpdateRequestDto,
  WgServerDto,
} from "~@api/api-gen/data-contracts";
import {
  CombinedHolder,
  EntityHolder,
  MutationHolder,
  PollingHolder,
} from "~@core/holders";
import { ServerModel } from "~@models";

import { IServerDetailStore } from "./ServerDetailStore.types";

@IServerDetailStore({ inSingleton: true })
export class ServerDetailStore implements IServerDetailStore {
  public serverHolder = new EntityHolder<WgServerDto, string>({
    onFetch: id => this._apiService.getServer(id),
  });
  public statusHolder = new PollingHolder<IWgServerStatusDto, string>({
    onFetch: id => this._apiService.getServerStatus(id),
    interval: 10_000,
  });
  public pageHolder = new CombinedHolder([
    this.serverHolder,
    this.statusHolder,
  ]);
  public serverActionMutation = new MutationHolder<string, WgServerDto>();
  public deleteServerMutation = new MutationHolder<string, boolean>({
    onMutate: async id => this._apiService.deleteServer(id),
  });
  public updateServerMutation = new MutationHolder<
    { id: string; params: IWgServerUpdateRequestDto },
    WgServerDto
  >({
    onMutate: async args => {
      const res = await this._apiService.updateServer(args.id, args.params);

      if (res.data) {
        this.serverHolder.setData(res.data);
      }

      return res;
    },
  });

  constructor(@IApiService() private _apiService: IApiService) {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  get server() {
    return this.serverHolder.data;
  }

  get serverModel() {
    return this.serverHolder.data
      ? new ServerModel(this.serverHolder.data)
      : null;
  }

  get liveStatus() {
    return this.statusHolder.data;
  }

  async loadServer(id: string) {
    const res = await this.serverHolder.load(id);

    return res.data;
  }

  async loadServerStatus(id: string) {
    const res = await this.statusHolder.load(id);

    return res.data;
  }

  startStatusPolling(id: string) {
    this.statusHolder.startPolling({ args: id });
  }

  stopStatusPolling() {
    this.statusHolder.stopPolling();
  }

  async createServer(params: IWgServerCreateRequestDto) {
    await this._apiService.createServer(params);
  }

  async updateServer(id: string, params: IWgServerUpdateRequestDto) {
    return this.updateServerMutation.execute({ id, params });
  }

  async deleteServer(id: string) {
    return this.deleteServerMutation.execute(id);
  }

  async startServer(id: string) {
    return this.serverActionMutation.execute(id, async args => {
      const res = await this._apiService.startServer(args);

      if (res.data) {
        this.serverHolder.setData(res.data);
      }

      return res;
    });
  }

  async stopServer(id: string) {
    return this.serverActionMutation.execute(id, async args => {
      const res = await this._apiService.stopServer(args);

      if (res.data) {
        this.serverHolder.setData(res.data);
      }

      return res;
    });
  }

  async restartServer(id: string) {
    return this.serverActionMutation.execute(id, async args => {
      const res = await this._apiService.restartServer(args);

      if (res.data) {
        this.serverHolder.setData(res.data);
      }

      return res;
    });
  }
}
