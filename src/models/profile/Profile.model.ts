import { computed, makeObservable } from "mobx";

import { ERole, ProfileDto } from "~@api/api-gen/data-contracts";
import { LambdaValue } from "~@common/helpers/lambdaValue";
import { DataModelBase } from "~@common/store/models";

import { DateModel } from "../date";

export class ProfileModel extends DataModelBase<ProfileDto> {
  public readonly registeredAtDate = new DateModel(() => this.data?.createdAt);
  public readonly lastOnlineDate = new DateModel(() => this.data.lastOnline);
  public readonly birthDateModel = new DateModel(() => this.data.birthDate);

  constructor(data: LambdaValue<ProfileDto>) {
    super(data);
    makeObservable(this, {
      displayName: computed,
      initials: computed,
      email: computed,
      phone: computed,
      login: computed,
      roleLabel: computed,
      emailVerified: computed,
    });
  }

  get displayName() {
    const name = [this.data.firstName, this.data.lastName]
      .filter(Boolean)
      .join(" ");

    return name || this.email || this.phone || "Без имени";
  }

  get initials() {
    const parts = [this.data.firstName, this.data.lastName].filter(Boolean);

    if (parts.length > 0) {
      return parts
        .map(s => s![0])
        .join("")
        .toUpperCase();
    }

    return (this.data.user?.email?.[0] ?? "U").toUpperCase();
  }

  get email() {
    return this.data.user?.email;
  }

  get phone() {
    return this.data.user?.phone;
  }

  get login() {
    return this.email ?? this.phone;
  }

  get roleLabel() {
    return this.data.user?.roles?.[0]?.name ?? ERole.User;
  }

  get emailVerified() {
    return this.data.user?.emailVerified;
  }
}
