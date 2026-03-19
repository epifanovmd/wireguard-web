import { makeAutoObservable } from "mobx";

import { IApiService } from "~@api";
import {
  IWgServerCreateRequestDto,
  IWgServerStatusDto,
  IWgServerUpdateRequestDto,
  WgServerDto,
} from "~@api/api-gen/data-contracts";
import { CombinedHolder, EntityHolder, PollingHolder } from "~@core/holders";
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
    const res = await this._apiService.updateServer(id, params);

    if (res.data) {
      this.serverHolder.setData(res.data);
    }

    return res;
  }

  async deleteServer(id: string) {
    const res = await this._apiService.deleteServer(id);

    return res;
  }

  async startServer(id: string) {
    const res = await this._apiService.startServer(id);

    if (res.data) {
      this.serverHolder.setData(res.data);
    }

    return res;
  }

  async stopServer(id: string) {
    const res = await this._apiService.stopServer(id);

    if (res.data) {
      this.serverHolder.setData(res.data);
    }

    return res;
  }

  async restartServer(id: string) {
    const res = await this._apiService.restartServer(id);

    if (res.data) {
      this.serverHolder.setData(res.data);
    }

    return res;
  }
}
