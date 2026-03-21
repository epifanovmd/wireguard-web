import { DataModelBase } from "@force-dev/utils";
import { computed, makeObservable } from "mobx";

import { EPermissions, ERole, UserDto } from "~@api/api-gen/data-contracts";
import { computeEffectivePermissions, isAdminRole } from "~@core/permissions";

import { DateModel } from "../date";

export class UserModel extends DataModelBase<UserDto> {
  public readonly createdAtDate = new DateModel(() => this.data.createdAt);
  public readonly updatedAtDate = new DateModel(() => this.data.updatedAt);
  public readonly lastOnlineDate = new DateModel(
    () => this.data.profile?.lastOnline,
  );

  constructor(data: UserDto) {
    super(data);
    makeObservable(this, {
      displayName: computed,
      initials: computed,
      login: computed,
      roles: computed,
      directPermissions: computed,
      effectivePermissions: computed,
      isAdmin: computed,
      roleLabel: computed,
      emailVerified: computed,
      createdAt: computed,
      updatedAt: computed,
      lastOnline: computed,
    });
  }

  get displayName() {
    const p = this.data.profile;
    const name = [p?.firstName, p?.lastName].filter(Boolean).join(" ");

    return name || this.data.email || this.data.phone || "Unknown";
  }

  get initials() {
    const p = this.data.profile;
    const parts = [p?.firstName, p?.lastName].filter(Boolean);

    if (parts.length > 0)
      return parts
        .map(s => s![0])
        .join("")
        .toUpperCase();

    return (this.data.email?.[0] ?? "U").toUpperCase();
  }

  get login() {
    return this.data.email ?? this.data.phone;
  }

  /** Роли пользователя (массив ERole) */
  get roles(): ERole[] {
    return this.data.roles.map(r => r.name);
  }

  /** Прямые права пользователя */
  get directPermissions(): EPermissions[] {
    return this.data.directPermissions.map(p => p.name);
  }

  /** Effective permissions = union(роль.permissions) + directPermissions */
  get effectivePermissions(): EPermissions[] {
    const rolePerms = this.data.roles.flatMap(r =>
      r.permissions.map(p => p.name),
    );

    return computeEffectivePermissions(rolePerms, this.directPermissions);
  }

  get isAdmin(): boolean {
    return isAdminRole(this.roles);
  }

  /** Отображаемое имя первой роли */
  get roleLabel() {
    return this.data.roles[0]?.name ?? ERole.User;
  }

  get emailVerified() {
    return this.data.emailVerified;
  }

  get createdAt() {
    return this.createdAtDate.formattedDate;
  }

  get updatedAt() {
    return this.updatedAtDate.formattedDate;
  }

  get lastOnline() {
    return this.lastOnlineDate.data
      ? this.lastOnlineDate.formattedDate
      : undefined;
  }
}
