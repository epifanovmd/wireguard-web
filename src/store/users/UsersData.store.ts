import { DataHolder } from "@force-dev/utils";
import { makeAutoObservable } from "mobx";

import { IApiService } from "~@api";
import {
  IUserListDto,
  IUserPrivilegesRequestDto,
  IUserUpdateRequestDto,
  UserDto,
} from "~@api/api-gen/data-contracts";
import { PublicUserModel, UserModel } from "~@models";

import { IUsersDataStore } from "./UsersData.types";

@IUsersDataStore({ inSingleton: true })
export class UsersDataStore implements IUsersDataStore {
  public listHolder = new DataHolder<IUserListDto>();
  public userHolder = new DataHolder<UserDto>();
  public offset = 0;
  public limit = 20;

  constructor(@IApiService() private _apiService: IApiService) {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  get users() {
    return this.listHolder.d?.data ?? [];
  }

  get total() {
    return this.listHolder.d?.count ?? 0;
  }

  get models() {
    return this.users.map(u => new PublicUserModel(u));
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

  setOffset(offset: number) {
    this.offset = offset;
  }

  async loadUsers() {
    this.listHolder.setLoading();
    const res = await this._apiService.getUsers({
      offset: this.offset,
      limit: this.limit,
    });

    if (res.error) {
      this.listHolder.setError(res.error.message);
    } else if (res.data) {
      this.listHolder.setData(res.data);
    }
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
      this._updateInList(res.data);
    }

    return res;
  }

  async setPrivileges(id: string, params: IUserPrivilegesRequestDto) {
    const res = await this._apiService.setPrivileges(id, params);

    if (res.data) {
      this.userHolder.setData(res.data);
      this._updateInList(res.data);
    }

    return res;
  }

  async deleteUser(id: string) {
    const res = await this._apiService.deleteUser(id);

    if (!res.error) {
      this.listHolder.setData({
        ...this.listHolder.d!,
        data: this.users.filter((u: any) => u.userId !== id),
        count: (this.total || 1) - 1,
      });
    }

    return res;
  }

  private _updateInList(user: UserDto) {
    if (this.listHolder.d) {
      this.listHolder.setData({
        ...this.listHolder.d,
        data: this.listHolder.d.data.map((u: any) =>
          u.userId === user.id ? { ...u } : u,
        ),
      });
    }
  }
}
