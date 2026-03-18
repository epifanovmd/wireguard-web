import { DataHolder, ListCollectionHolder } from "@force-dev/utils";
import { makeAutoObservable, runInAction } from "mobx";

import { IApiService } from "~@api";
import {
  IUserPrivilegesRequestDto,
  IUserUpdateRequestDto,
  PublicUserDto,
  UserDto,
} from "~@api/api-gen/data-contracts";
import { PublicUserModel, UserModel } from "~@models";

import { IUsersDataStore } from "./UsersData.types";

@IUsersDataStore({ inSingleton: true })
export class UsersDataStore implements IUsersDataStore {
  public listHolder = new ListCollectionHolder<PublicUserDto>();
  public userHolder = new DataHolder<UserDto>();
  public total = 0;

  private _pageOffset = 0;

  constructor(@IApiService() private _apiService: IApiService) {
    makeAutoObservable(this, {}, { autoBind: true });

    this.listHolder.initialize({
      keyExtractor: u => u.userId,
      onFetchData: async ({ limit }) => {
        const res = await this._apiService.getUsers({
          offset: this._pageOffset,
          limit,
        });

        const data = res.data?.data ?? [];

        runInAction(() => {
          this.total = res.data?.count ?? this.total;
        });

        this.listHolder.updateData(data, { replace: true });

        return data;
      },
      pageSize: 20,
    });
  }

  get models() {
    return this.listHolder.d.map(u => new PublicUserModel(u));
  }

  get isLoading() {
    return this.listHolder.isLoading;
  }

  get user() {
    return this.userHolder.d;
  }

  get userModel() {
    return this.userHolder.d ? new UserModel(this.userHolder.d) : undefined;
  }

  async load(pageOffset = 0) {
    this._pageOffset = pageOffset;
    await this.listHolder.performRefresh();
  }

  async loadUser(id: string) {
    this.userHolder.setLoading();
    const res = await this._apiService.getUserById(id);

    if (res.error) {
      this.userHolder.setError(res.error.message);
    } else if (res.data) {
      this.userHolder.setData(res.data);

      return res.data;
    }

    return undefined;
  }

  async updateUser(id: string, params: IUserUpdateRequestDto) {
    const res = await this._apiService.updateUser(id, params);

    if (res.data) {
      this.userHolder.setData(res.data);
      this.listHolder.updateData(
        this.listHolder.d.filter(u => u.userId !== id),
        { replace: true },
      );
    }

    return res;
  }

  async setPrivileges(id: string, params: IUserPrivilegesRequestDto) {
    const res = await this._apiService.setPrivileges(id, params);

    if (res.data) {
      this.userHolder.setData(res.data);
    }

    return res;
  }

  async deleteUser(id: string) {
    const res = await this._apiService.deleteUser(id);

    if (!res.error) {
      this.listHolder.updateData(
        this.listHolder.d.filter(u => u.userId !== id),
        { replace: true },
      );
      runInAction(() => {
        this.total = Math.max(0, this.total - 1);
      });
    }

    return res;
  }
}
