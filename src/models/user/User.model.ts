import { DataModelBase } from "@force-dev/utils";
import { format, parseISO } from "date-fns";

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

  get login() {
    return this.data.email ?? this.data.phone;
  }

  get isAdmin() {
    return this.data.role?.name === ERole.Admin;
  }

  get roleLabel() {
    return this.data.role?.name ?? ERole.User;
  }

  get emailVerified() {
    return this.data.emailVerified;
  }

  get createdAt() {
    return format(parseISO(this.data.createdAt), "d MMMM yyyy");
  }

  get updatedAt() {
    return format(parseISO(this.data.updatedAt), "d MMMM yyyy");
  }

  get lastOnline() {
    if (!this.data.profile?.lastOnline) return undefined;

    return format(parseISO(this.data.profile.lastOnline), "d MMMM yyyy");
  }
}
