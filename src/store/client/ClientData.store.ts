import { DataHolder } from "@force-dev/utils";
import { makeAutoObservable } from "mobx";

import { IApiService } from "~@api";
import { WgPeerDto } from "~@api/api-gen/data-contracts";
import { ClientModel } from "~@models";

import { IClientDataStore } from "./ClientData.types";

@IClientDataStore()
export class ClientDataStore implements IClientDataStore {
  public holder = new DataHolder<WgPeerDto>();

  constructor(@IApiService() private _apiService: IApiService) {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  get data() {
    return this.holder.d;
  }

  get model() {
    return this.data ? new ClientModel(this.data) : undefined;
  }

  get loading() {
    return this.holder.isLoading;
  }

  async onRefresh(clientId: string) {
    this.holder.setLoading();
    const res = await this._apiService.getPeer(clientId);

    if (res.axiosError) {
      if (!res.isCanceled) {
        this.holder.setError(res.axiosError.toString());
      }
    } else if (res.data) {
      this.holder.setData(res.data);

      return res.data;
    }

    return undefined;
  }
}
