import { DataModelBase } from "@force-dev/utils";
import { format, parseISO } from "date-fns";

import { EWgServerStatus, WgServerDto } from "~@api/api-gen/data-contracts";

const STATUS_LABELS: Record<EWgServerStatus, string> = {
  [EWgServerStatus.Up]: "Активен",
  [EWgServerStatus.Down]: "Остановлен",
  [EWgServerStatus.Error]: "Ошибка",
  [EWgServerStatus.Unknown]: "Неизвестно",
};

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
    return STATUS_LABELS[this.data.status] ?? this.data.status;
  }

  get enabled() {
    return this.data.enabled;
  }

  get enabledLabel() {
    return this.data.enabled ? "Активен" : "Отключён";
  }

  get description() {
    return this.data.description ?? "—";
  }

  get endpoint() {
    return this.data.endpoint ?? "—";
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
