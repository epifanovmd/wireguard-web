import { DataModelBase } from "@force-dev/utils";
import { computed, makeObservable } from "mobx";

import { WgPeerDto } from "~@api/api-gen/data-contracts";

import { DateModel } from "../date";

// Legacy compatibility alias
export type IWgClientsDto = WgPeerDto & {
  latestHandshakeAt?: string;
  transferRx?: number;
  transferTx?: number;
  address?: string;
};

export class ClientModel extends DataModelBase<IWgClientsDto> {
  public readonly date = new DateModel(() => this.data.latestHandshakeAt);

  constructor(data: IWgClientsDto) {
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
