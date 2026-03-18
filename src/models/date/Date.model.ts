import { DataModelBase, Maybe } from "@force-dev/utils";
import { computed, makeObservable } from "mobx";

import { formatter } from "~@common";

export class DateModel extends DataModelBase<Maybe<string>> {
  constructor(value: Maybe<string> | (() => Maybe<string>)) {
    super(value);
    makeObservable(this, {
      formatted: computed,
      formattedDate: computed,
      formattedTime: computed,
      formattedInputDate: computed,
      formattedDiff: computed,
      isExpired: computed,
    });
  }

  get formatted() {
    return formatter.date.format(this.data);
  }

  get formattedDate() {
    return formatter.date.formatDate(this.data);
  }

  get formattedTime() {
    return formatter.date.formatTime(this.data);
  }

  get formattedInputDate() {
    return formatter.date.formatInputDate(this.data);
  }

  get formattedDiff() {
    return formatter.date.formatDiff(this.data);
  }

  get isExpired() {
    return formatter.date.isExpired(this.data);
  }
}
