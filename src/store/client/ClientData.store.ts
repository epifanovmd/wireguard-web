import { IApiService } from "@api";
import { WgPeerDto } from "@api/api-gen/data-contracts";
import { ClientModel } from "@models";
import { EntityHolder } from "@store";
import { makeAutoObservable } from "mobx";

import { IClientDataStore } from "./ClientData.types";

@IClientDataStore()
export class ClientDataStore implements IClientDataStore {
  public holder = new EntityHolder<WgPeerDto, string>({
    onFetch: id => this._apiService.getPeer({ id }),
  });

  constructor(@IApiService() private _apiService: IApiService) {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  get data() {
    return this.holder.data ?? undefined;
  }

  get model() {
    return this.holder.data ? new ClientModel(this.holder.data) : undefined;
  }

  get loading() {
    return this.holder.isLoading;
  }

  async onRefresh(clientId: string) {
    const res = await this.holder.load(clientId);

    return res.data ?? undefined;
  }
}
