import { DataHolder } from "@force-dev/utils";
import { notification } from "antd";
import { makeAutoObservable, runInAction } from "mobx";

import { IApiService } from "~@api";
import {
  CreateWgServerPayload,
  IWgServerDto,
} from "~@api/api-gen/data-contracts";
import { ServerModel } from "~@models";

import { IServerDataStore } from "./ServerData.types";

@IServerDataStore()
export class ServerDataStore implements IServerDataStore {
  public holder = new DataHolder<IWgServerDto[]>();
  public enabled = false;

  constructor(@IApiService() private _apiService: IApiService) {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  get data() {
    return this.holder.d ?? [];
  }

  get models() {
    return this.data.map(item => new ServerModel(item));
  }

  get loading() {
    return this.holder.isLoading;
  }

  async createServer(data: CreateWgServerPayload) {
    const server = await this._apiService.createWgServer(data);

    if (server.data) {
      this.holder.setData([...this.data, server.data]);

      return server.data;
    }

    return undefined;
  }

  async deleteServer(serverId: string) {
    const res = await this._apiService.deleteWgServer(serverId);

    if (res.error) {
      notification.error({ message: res.error.message });
      throw res.error;
    }

    this.holder.setData(this.data.filter(item => item.id !== serverId));
  }

  async getStatus(serverId: string) {
    const res = await this._apiService.getServerStatus(serverId);

    if (res.error) {
      notification.error({ message: res.error.message });
      throw res.error;
    } else {
      runInAction(() => {
        this.enabled = !!res.data;
      });
    }
  }

  async startServer(serverId: string) {
    const res = await this._apiService.startServer(serverId);

    if (res.error) {
      if (!res.isCanceled) {
        notification.error({ message: res.error.message });
      }
    } else {
      runInAction(() => {
        this.enabled = true;
      });
    }
  }

  async stopServer(serverId: string) {
    const res = await this._apiService.stopServer(serverId);

    if (res.error) {
      if (!res.isCanceled) {
        notification.error({ message: res.error.message });
      }
    } else {
      runInAction(() => {
        this.enabled = false;
      });
    }
  }

  async onRefresh() {
    this.holder.setLoading();
    const res = await this._apiService.getWgServers({});

    if (res.error) {
      if (!res.isCanceled) {
        this.holder.setError(res.error.toString());
      }
    } else if (res.data) {
      this.holder.setData(res.data.data);

      return res.data.data;
    }

    return undefined;
  }
}
