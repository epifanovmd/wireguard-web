import { DataHolder } from "@force-dev/utils";
import { notification } from "antd";
import { makeAutoObservable } from "mobx";

import { ServerModel } from "~@models";
import { ICreateServerRequest, IServer, IServerService } from "~@service";

import { IServerDataStore } from "./ServerData.types";

@IServerDataStore()
export class ServerDataStore implements IServerDataStore {
  public holder = new DataHolder<IServer[]>();
  public enabled = false;

  constructor(@IServerService() private _serversService: IServerService) {
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

  async createServer(data: ICreateServerRequest) {
    const server = await this._serversService.createServer(data);

    if (server.data) {
      this.holder.setData([...this.data, server.data]);

      return server.data;
    }

    return undefined;
  }

  async deleteServer(serverId: string) {
    const res = await this._serversService.deleteServer(serverId);

    if (res.error) {
      notification.error({ message: res.error.message });
      throw res.error;
    }

    this.holder.setData(this.data.filter(item => item.id !== serverId));
  }

  async getStatus(serverId: string) {
    const res = await this._serversService.getStatus(serverId);

    if (res.error) {
      notification.error({ message: res.error.message });
      throw res.error;
    } else {
      this.enabled = !!res.data;
    }
  }

  async startServer(serverId: string) {
    const res = await this._serversService.serverStart(serverId);

    if (res.error) {
      if (!res.isCanceled) {
        notification.error({ message: res.error.message });
      }
    } else {
      this.enabled = true;
    }
  }

  async stopServer(serverId: string) {
    const res = await this._serversService.serverStop(serverId);

    if (res.error) {
      if (!res.isCanceled) {
        notification.error({ message: res.error.message });
      }
    } else {
      this.enabled = false;
    }
  }

  async onRefresh() {
    this.holder.setLoading();
    const res = await this._serversService.getServers();

    if (res.error) {
      if (!res.isCanceled) {
        this.holder.setError({ msg: res.error.toString() });
      }
    } else if (res.data) {
      this.holder.setData(res.data.data);

      return res.data.data;
    }

    return undefined;
  }
}
