import { DataHolder } from "@force-dev/utils";
import { makeAutoObservable } from "mobx";

import { IApiService } from "~@api";
import {
  IWgServerCreateRequestDto,
  IWgServerStatusDto,
  IWgServerUpdateRequestDto,
  WgServerDto,
} from "~@api/api-gen/data-contracts";
import { ServerModel } from "~@models";

import { IServerDetailStore } from "./ServerDetailStore.types";

@IServerDetailStore({ inSingleton: true })
export class ServerDetailStore implements IServerDetailStore {
  public serverHolder = new DataHolder<WgServerDto>();
  public statusHolder = new DataHolder<IWgServerStatusDto>();

  constructor(@IApiService() private _apiService: IApiService) {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  get server() {
    return this.serverHolder.d;
  }

  get serverModel() {
    return this.serverHolder.d ? new ServerModel(this.serverHolder.d) : undefined;
  }

  get liveStatus() {
    return this.statusHolder.d;
  }

  async loadServer(id: string) {
    this.serverHolder.setLoading();
    const res = await this._apiService.getServer(id);

    if (res.error) {
      this.serverHolder.setError(res.error.message);
    } else if (res.data) {
      this.serverHolder.setData(res.data);

      return res.data;
    }

    return undefined;
  }

  async loadServerStatus(id: string) {
    const res = await this._apiService.getServerStatus(id);

    if (res.data) {
      this.statusHolder.setData(res.data);

      return res.data;
    }

    return undefined;
  }

  async createServer(params: IWgServerCreateRequestDto) {
    return this._apiService.createServer(params);
  }

  async updateServer(id: string, params: IWgServerUpdateRequestDto) {
    const res = await this._apiService.updateServer(id, params);

    if (res.data) {
      this.serverHolder.setData(res.data);
    }

    return res;
  }

  async deleteServer(id: string) {
    return this._apiService.deleteServer(id);
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
