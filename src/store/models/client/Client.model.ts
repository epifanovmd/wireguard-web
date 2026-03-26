import { WgPeerDto } from "@api/api-gen/data-contracts";
import { computed, makeObservable } from "mobx";

import { DataModelBase } from "../DataModelBase";
import { DateModel } from "../date";

export class ClientModel extends DataModelBase<WgPeerDto> {
  public readonly date = new DateModel(() => this.data.lastHandshake);

  constructor(data: WgPeerDto) {
    super(data);
    makeObservable(this, {
      name: computed,
      enabled: computed,
    });
  }

  get name() {
    return this.data.name;
  }

  get enabled() {
    return this.data.enabled ? "Активен" : "Отключен";
  }
}
