import { makeAutoObservable } from "mobx";

import { IApiService } from "~@api";
import {
  IUserPrivilegesRequestDto,
  IUserUpdateRequestDto,
  PublicUserDto,
  UserDto,
} from "~@api/api-gen/data-contracts";
import { EntityHolder, MutationHolder, PagedHolder } from "~@core/holders";
import { PublicUserModel, UserModel } from "~@models";

import { IUsersDataStore } from "./UsersData.types";

@IUsersDataStore({ inSingleton: true })
export class UsersDataStore implements IUsersDataStore {
  public listHolder = new PagedHolder<PublicUserDto>({
    keyExtractor: u => u.userId,
    pageSize: 1000,
    onFetch: pagination => this._apiService.getUsers(pagination),
  });
  public userHolder = new EntityHolder<UserDto, string>({
    onFetch: id => this._apiService.getUserById({ id }),
  });
  public setPrivilegesMutation = new MutationHolder<
    { id: string; params: IUserPrivilegesRequestDto },
    UserDto
  >();
  public deleteUserMutation = new MutationHolder<string, boolean>();

  constructor(@IApiService() private _apiService: IApiService) {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  get models() {
    return this.listHolder.items.map(u => new PublicUserModel(u));
  }

  get isLoading() {
    return this.listHolder.isLoading;
  }

  get total() {
    return this.listHolder.pagination.totalCount;
  }

  get user() {
    return this.userHolder.data;
  }

  get userModel() {
    return this.userHolder.data ? new UserModel(this.userHolder.data) : null;
  }

  async load() {
    await this.listHolder.load();
  }

  async loadUser(id: string) {
    const res = await this.userHolder.load(id);

    return res.data;
  }

  async updateUser(id: string, params: IUserUpdateRequestDto) {
    const res = await this._apiService.updateUser({ id }, params);

    if (res.data) {
      this.userHolder.setData(res.data);
      this.listHolder.removeItem(id);
    }

    return res;
  }

  async setPrivileges(id: string, params: IUserPrivilegesRequestDto) {
    return this.setPrivilegesMutation.execute({ id, params }, async args => {
      const res = await this._apiService.setPrivileges({ id: args.id }, args.params);

      if (res.data) {
        this.userHolder.setData(res.data);
      }

      return res;
    });
  }

  async deleteUser(id: string) {
    return this.deleteUserMutation.execute(id, async args => {
      const res = await this._apiService.deleteUser({ id: args });

      if (!res.error) {
        this.listHolder.removeItem(args);
      }

      return res;
    });
  }
}
