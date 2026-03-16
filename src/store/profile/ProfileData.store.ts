import { DataHolder } from "@force-dev/utils";
import { makeAutoObservable } from "mobx";

import { IApiService } from "~@api";
import { ProfileDto } from "~@api/api-gen/data-contracts";

import { IProfileDataStore } from "./ProfileData.types";

@IProfileDataStore({ inSingleton: true })
export class ProfileDataStore implements IProfileDataStore {
  public holder = new DataHolder<ProfileDto>();

  constructor(@IApiService() private _apiService: IApiService) {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  get profile() {
    return this.holder.d;
  }

  get isLoading() {
    return this.holder.isLoading;
  }

  get isError() {
    return this.holder.isError;
  }

  get isEmpty() {
    return this.holder.isEmpty;
  }

  async getProfile() {
    this.holder.setLoading();

    const res = await this._apiService.getMyProfile();

    if (res.error) {
      this.holder.setError(res.error.message);
    } else if (res.data) {
      this.holder.setData(res.data);

      return res.data;
    }

    return undefined;
  }
}
