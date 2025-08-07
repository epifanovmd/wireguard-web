import { DataModelBase } from "@force-dev/utils";

import { IWgClientsDto } from "~@api/api-gen/data-contracts";

import { DateModel } from "../date";

export class ClientModel extends DataModelBase<IWgClientsDto> {
  public date = new DateModel(() => this.data.latestHandshakeAt);

  public get name() {
    return this.data.name;
  }

  public get enabled() {
    return this.data.enabled ? "Активен" : "Отключен";
  }
}
