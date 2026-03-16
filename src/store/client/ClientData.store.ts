import { DataHolder } from "@force-dev/utils";
import { makeAutoObservable } from "mobx";

import { IApiService } from "~@api";
import { ClientModel, IWgClientsDto } from "~@models";

import { IClientDataStore } from "./ClientData.types";

@IClientDataStore()
export class ClientDataStore implements IClientDataStore {
  public holder = new DataHolder<IWgClientsDto>();

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
      this.holder.setData(res.data as IWgClientsDto);

      return res.data as IWgClientsDto;
    }

    return undefined;
  }
}
