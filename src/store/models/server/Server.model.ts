import { EWgServerStatus, WgServerDto } from "@api/api-gen/data-contracts";
import { computed, makeObservable } from "mobx";

import { DataModelBase } from "../DataModelBase";
import { DateModel } from "../date";
import { WgStatusModel } from "../wgStatus/WgStatus.model";

const STATUS_LABELS: Record<EWgServerStatus, string> = {
  [EWgServerStatus.Up]: "Активен",
  [EWgServerStatus.Down]: "Остановлен",
  [EWgServerStatus.Error]: "Ошибка",
  [EWgServerStatus.Unknown]: "Неизвестно",
};

export class ServerModel extends DataModelBase<WgServerDto> {
  public readonly status = new WgStatusModel(() => this.data.status);
  public readonly createdAtDate = new DateModel(() => this.data.createdAt);
  public readonly updatedAtDate = new DateModel(() => this.data.updatedAt);

  constructor(data: WgServerDto) {
    super(data);
    makeObservable(this, {
      name: computed,
      statusLabel: computed,
      enabled: computed,
      enabledLabel: computed,
      description: computed,
      endpoint: computed,
      shortPublicKey: computed,
    });
  }

  get name() {
    return this.data.name;
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

  get shortPublicKey() {
    return this.data.publicKey.slice(0, 16) + "...";
  }
}
