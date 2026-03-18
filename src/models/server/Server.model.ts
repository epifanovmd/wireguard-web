import { DataModelBase } from "@force-dev/utils";
import { computed, makeObservable } from "mobx";

import { EWgServerStatus, WgServerDto } from "~@api/api-gen/data-contracts";

import { DateModel } from "../date";

const STATUS_LABELS: Record<EWgServerStatus, string> = {
  [EWgServerStatus.Up]: "Активен",
  [EWgServerStatus.Down]: "Остановлен",
  [EWgServerStatus.Error]: "Ошибка",
  [EWgServerStatus.Unknown]: "Неизвестно",
};

export class ServerModel extends DataModelBase<WgServerDto> {
  public readonly createdAtDate = new DateModel(() => this.data.createdAt);
  public readonly updatedAtDate = new DateModel(() => this.data.updatedAt);

  constructor(data: WgServerDto) {
    super(data);
    makeObservable(this, {
      name: computed,
      isUp: computed,
      isDown: computed,
      isError: computed,
      statusLabel: computed,
      enabled: computed,
      enabledLabel: computed,
      description: computed,
      endpoint: computed,
      createdAt: computed,
      updatedAt: computed,
      shortPublicKey: computed,
    });
  }

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
    return this.createdAtDate.formattedDate;
  }

  get updatedAt() {
    return this.updatedAtDate.formatted;
  }

  get shortPublicKey() {
    return this.data.publicKey.slice(0, 16) + "...";
  }
}
