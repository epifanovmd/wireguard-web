import { DataModelBase } from "@force-dev/utils";
import { format, isAfter, parseISO } from "date-fns";

import { WgPeerDto } from "~@api/api-gen/data-contracts";

export class PeerModel extends DataModelBase<WgPeerDto> {
  get name() {
    return this.data.name;
  }

  get enabled() {
    return this.data.enabled;
  }

  get enabledLabel() {
    return this.data.enabled ? "Активен" : "Отключён";
  }

  get isExpired() {
    if (!this.data.expiresAt) return false;

    return isAfter(new Date(), parseISO(this.data.expiresAt));
  }

  get description() {
    return this.data.description ?? "—";
  }

  get endpoint() {
    return this.data.endpoint ?? "—";
  }

  get expiresAt() {
    return this.data.expiresAt
      ? format(parseISO(this.data.expiresAt), "d MMMM yyyy, HH:mm")
      : null;
  }

  get createdAt() {
    return format(parseISO(this.data.createdAt), "d MMMM yyyy");
  }

  get updatedAt() {
    return format(parseISO(this.data.updatedAt), "d MMMM yyyy, HH:mm");
  }

  get shortPublicKey() {
    return this.data.publicKey.slice(0, 16) + "...";
  }
}
