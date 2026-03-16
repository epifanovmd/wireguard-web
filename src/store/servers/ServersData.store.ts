import { DataHolder } from "@force-dev/utils";
import { makeAutoObservable } from "mobx";

import { IApiService } from "~@api";
import {
  IWgServerCreateRequestDto,
  IWgServerListDto,
  IWgServerStatusDto,
  IWgServerUpdateRequestDto,
  WgServerDto,
} from "~@api/api-gen/data-contracts";
import { ServerModel } from "~@models";

import { IServersDataStore } from "./ServersData.types";

@IServersDataStore({ inSingleton: true })
export class ServersDataStore implements IServersDataStore {
  public listHolder = new DataHolder<IWgServerListDto>();
  public serverHolder = new DataHolder<WgServerDto>();
  public statusHolder = new DataHolder<IWgServerStatusDto>();

  constructor(@IApiService() private _apiService: IApiService) {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  get servers() {
    return this.listHolder.d?.data ?? [];
  }

  get total() {
    return this.listHolder.d?.count ?? 0;
  }

  get models() {
    return this.servers.map(s => new ServerModel(s));
  }

  get isLoading() {
    return this.listHolder.isLoading;
  }

  get server() {
    return this.serverHolder.d;
  }

  get serverModel() {
    return this.serverHolder.d
      ? new ServerModel(this.serverHolder.d)
      : undefined;
  }

  get liveStatus() {
    return this.statusHolder.d;
  }

  async loadServers() {
    this.listHolder.setLoading();
    const res = await this._apiService.getServers();

    if (res.error) {
      this.listHolder.setError(res.error.message);
    } else if (res.data) {
      this.listHolder.setData(res.data);
    }
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
    const res = await this._apiService.createServer(params);

    if (res.data) {
      this.listHolder.setData({
        count: this.total + 1,
        data: [...this.servers, res.data],
      });
    }

    return res;
  }

  async updateServer(id: string, params: IWgServerUpdateRequestDto) {
    const res = await this._apiService.updateServer(id, params);

    if (res.data) {
      this.serverHolder.setData(res.data);
      this._updateInList(res.data);
    }

    return res;
  }

  async deleteServer(id: string) {
    const res = await this._apiService.deleteServer(id);

    if (!res.error) {
      this.listHolder.setData({
        count: Math.max(0, this.total - 1),
        data: this.servers.filter(s => s.id !== id),
      });
    }

    return res;
  }

  async startServer(id: string) {
    const res = await this._apiService.startServer(id);

    if (res.data) {
      this.serverHolder.setData(res.data);
      this._updateInList(res.data);
    }

    return res;
  }

  async stopServer(id: string) {
    const res = await this._apiService.stopServer(id);

    if (res.data) {
      this.serverHolder.setData(res.data);
      this._updateInList(res.data);
    }

    return res;
  }

  async restartServer(id: string) {
    const res = await this._apiService.restartServer(id);

    if (res.data) {
      this.serverHolder.setData(res.data);
      this._updateInList(res.data);
    }

    return res;
  }

  private _updateInList(server: WgServerDto) {
    if (this.listHolder.d) {
      this.listHolder.setData({
        ...this.listHolder.d,
        data: this.listHolder.d.data.map(s =>
          s.id === server.id ? server : s,
        ),
      });
    }
  }
}
