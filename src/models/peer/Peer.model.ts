import { DataModelBase } from "@force-dev/utils";
import { computed, makeObservable } from "mobx";

import { WgPeerDto } from "~@api/api-gen/data-contracts";

import { DateModel } from "../date";

export class PeerModel extends DataModelBase<WgPeerDto> {
  public readonly expiresAtDate = new DateModel(() => this.data.expiresAt);
  public readonly createdAtDate = new DateModel(() => this.data.createdAt);
  public readonly updatedAtDate = new DateModel(() => this.data.updatedAt);

  constructor(data: WgPeerDto) {
    super(data);
    makeObservable(this, {
      name: computed,
      status: computed,
      enabled: computed,
      enabledLabel: computed,
      isExpired: computed,
      description: computed,
      expiresAt: computed,
      createdAt: computed,
      updatedAt: computed,
      shortPublicKey: computed,
    });
  }

  get name() {
    return this.data.name;
  }

  get status() {
    return this.data.status;
  }

  get enabled() {
    return this.data.enabled;
  }

  get enabledLabel() {
    return this.data.enabled ? "Активен" : "Отключён";
  }

  get isExpired() {
    return this.expiresAtDate.isExpired;
  }

  get description() {
    return this.data.description ?? "—";
  }

  get expiresAt() {
    return this.expiresAtDate.data ? this.expiresAtDate.formatted : null;
  }

  get createdAt() {
    return this.createdAtDate.formattedDate;
  }

  get updatedAt() {
    return this.updatedAtDate.formatted;
  }

  get shortPublicKey() {
    return this.data.publicKey.slice(0, 16) + "...";
  }
}
