import { DataModelBase } from "@force-dev/utils";

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
  public date = new DateModel(() => this.data.latestHandshakeAt);

  public get name() {
    return this.data.name;
  }

  public get enabled() {
    return this.data.enabled ? "Активен" : "Отключен";
  }
}
