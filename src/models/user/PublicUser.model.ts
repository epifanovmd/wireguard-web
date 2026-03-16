import { DataModelBase } from "@force-dev/utils";

import { PublicUserDto } from "~@api/api-gen/data-contracts";

export class PublicUserModel extends DataModelBase<PublicUserDto> {
  get id() {
    return this.data.userId;
  }

  get displayName() {
    const p = this.data.profile;
    const name = [p?.firstName, p?.lastName].filter(Boolean).join(" ");

    return name || this.data.email || "Unknown";
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
}
