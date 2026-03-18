import { DataModelBase } from "@force-dev/utils";
import { computed, makeObservable } from "mobx";

import { EProfileStatus, PublicUserDto } from "~@api/api-gen/data-contracts";

import { DateModel } from "../date";

export class PublicUserModel extends DataModelBase<PublicUserDto> {
  public readonly lastOnlineDate = new DateModel(
    () => this.data.profile?.lastOnline,
  );

  constructor(data: PublicUserDto) {
    super(data);
    makeObservable(this, {
      id: computed,
      displayName: computed,
      initials: computed,
      isOnline: computed,
      lastOnline: computed,
    });
  }

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

  get isOnline() {
    return this.data.profile?.status === EProfileStatus.Online;
  }

  get lastOnline() {
    return this.lastOnlineDate.data
      ? this.lastOnlineDate.formattedDate
      : undefined;
  }
}
