import { WgPeerDto } from "@api/api-gen/data-contracts";
import { computed, makeObservable } from "mobx";

import { DataModelBase } from "../DataModelBase";
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
      isActive: computed,
      description: computed,
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

  get isActive() {
    return this.data.isActive;
  }

  get enabledLabel() {
    return this.data.enabled ? "Активен" : "Отключён";
  }

  get description() {
    return this.data.description ?? "—";
  }

  get shortPublicKey() {
    return this.data.publicKey.slice(0, 16) + "...";
  }
}
