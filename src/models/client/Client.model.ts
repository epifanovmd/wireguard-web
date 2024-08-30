import { DataModelBase } from "@force-dev/utils";

import { IClient } from "~@service";

import { DateModel } from "../date";

export class ClientModel extends DataModelBase<IClient> {
  public date = new DateModel(() => this.data.latestHandshakeAt);

  public get name() {
    return this.data.name;
  }

  public get enabled() {
    return this.data.enabled ? "Активен" : "Отключен";
  }
}
