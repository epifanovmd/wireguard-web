import { DataModelBase } from "@force-dev/utils";
import { format, parseISO } from "date-fns";

import { EWgServerStatus, WgServerDto } from "~@api/api-gen/data-contracts";

export class ServerModel extends DataModelBase<WgServerDto> {
  get name() {
    return this.data.name;
  }

  get isUp() {
    return this.data.status === EWgServerStatus.Up;
  }

  get isDown() {
    return this.data.status === EWgServerStatus.Down;
  }

  get isError() {
    return this.data.status === EWgServerStatus.Error;
  }

  get statusLabel() {
    return this.data.status;
  }

  get createdAtFormatted() {
    return format(parseISO(this.data.createdAt), "dd MMM yyyy");
  }

  get shortPublicKey() {
    return this.data.publicKey.slice(0, 16) + "...";
  }
}
