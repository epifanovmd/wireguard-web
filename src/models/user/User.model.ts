import { DataModelBase } from "@force-dev/utils";

import { ERole, UserDto } from "~@api/api-gen/data-contracts";

export class UserModel extends DataModelBase<UserDto> {
  get displayName() {
    const p = this.data.profile;
    const name = [p?.firstName, p?.lastName].filter(Boolean).join(" ");

    return name || this.data.email || this.data.phone || "Unknown";
  }

  get initials() {
    const p = this.data.profile;
    const parts = [p?.firstName, p?.lastName].filter(Boolean);

    if (parts.length > 0) return parts.map(s => s![0]).join("").toUpperCase();

    return (this.data.email?.[0] ?? "U").toUpperCase();
  }

  get isAdmin() {
    return this.data.role?.name === ERole.Admin;
  }

  get roleLabel() {
    return this.data.role?.name ?? "user";
  }
}
