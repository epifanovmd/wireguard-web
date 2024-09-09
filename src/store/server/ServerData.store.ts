import { DataHolder } from "@force-dev/utils";
import { makeAutoObservable } from "mobx";

import { ServerModel } from "~@models";
import { ICreateServerRequest, IServer, IServerService } from "~@service";

import { IServerDataStore } from "./ServerData.types";

@IServerDataStore()
export class ServerDataStore implements IServerDataStore {
  public holder = new DataHolder<IServer[]>();

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
    await this._serversService.deleteServer(serverId);
    this.holder.setData(this.data.filter(item => item.id !== serverId));

    return serverId;
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
