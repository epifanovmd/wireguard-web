import { DataModelBase } from "@force-dev/utils";
import { format, parseISO } from "date-fns";
import { ru } from "date-fns/locale";

import { ERole, ProfileDto } from "~@api/api-gen/data-contracts";

export class ProfileModel extends DataModelBase<ProfileDto> {
  get displayName() {
    const name = [this.data.firstName, this.data.lastName]
      .filter(Boolean)
      .join(" ");

    return (
      name || this.data.user?.email || this.data.user?.phone || "Без имени"
    );
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
    return this.data.user?.role?.name ?? ERole.User;
  }

  get emailVerified() {
    return this.data.user?.emailVerified;
  }

  get registeredAt() {
    if (!this.data.user?.createdAt) return undefined;

    return format(parseISO(this.data.user.createdAt), "d MMMM yyyy", {
      locale: ru,
    });
  }

  get lastOnlineFormatted() {
    if (!this.data.lastOnline) return undefined;

    return format(parseISO(this.data.lastOnline), "d MMMM yyyy", {
      locale: ru,
    });
  }

  get birthDateFormatted() {
    if (!this.data.birthDate) return undefined;

    return format(parseISO(this.data.birthDate), "d MMMM yyyy", {
      locale: ru,
    });
  }

  get birthDateInput() {
    if (!this.data.birthDate) return "";

    return format(parseISO(this.data.birthDate), "yyyy-MM-dd");
  }
}
