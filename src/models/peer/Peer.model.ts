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

  get statusLabel() {
    return this.data.enabled ? "Enabled" : "Disabled";
  }

  get isExpired() {
    if (!this.data.expiresAt) return false;

    return isAfter(new Date(), parseISO(this.data.expiresAt));
  }

  get expiresAtFormatted() {
    if (!this.data.expiresAt) return null;

    return format(parseISO(this.data.expiresAt), "dd MMM yyyy HH:mm");
  }

  get createdAtFormatted() {
    return format(parseISO(this.data.createdAt), "dd MMM yyyy");
  }

  get shortPublicKey() {
    return this.data.publicKey.slice(0, 16) + "...";
  }
}
