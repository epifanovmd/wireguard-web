import { makeAutoObservable } from "mobx";

import { IApiService } from "~@api";
import {
  IProfileUpdateRequestDto,
  UserDto,
} from "~@api/api-gen/data-contracts";
import { ProfileModel } from "~@models";

import { EntityHolder } from "../holders";
import { IUserDataStore } from "./UserData.types";

@IUserDataStore({ inSingleton: true })
export class UserDataStore implements IUserDataStore {
  public holder = new EntityHolder<UserDto>({
    onFetch: async () => {
      const res = await this._api.getMyUser();

      if (res.data && !res.data.profile) {
        const profile = await this._api.getMyProfile();

        if (profile.data) {
          res.data.profile = profile.data;
        }
      }

      return res;
    },
  });

  constructor(@IApiService() private _api: IApiService) {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  get user() {
    return this.holder.data;
  }

  get profile() {
    return this.user?.profile
      ? new ProfileModel({
          user: this.user,
          ...this.user.profile,
        })
      : undefined;
  }

  get isLoading() {
    return this.holder.isLoading;
  }

  get isError() {
    return this.holder.isError;
  }

  load() {
    return this.holder.load();
  }

  refresh() {
    return this.holder.refresh();
  }

  async updateProfile(data: IProfileUpdateRequestDto) {
    const res = await this._api.updateMyProfile(data);
    const user = this.holder.data;

    if (res.data && user) {
      this.holder.setData({ ...user, profile: res.data });
    }

    return res;
  }

  reset() {
    this.holder.reset();
  }
}
