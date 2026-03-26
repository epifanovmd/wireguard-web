import { computed, makeObservable } from "mobx";

import { formatter } from "~@common";
import { Maybe } from "~@common/ioc/types";
import { DataModelBase } from "~@common/store/models";

export class DateModel extends DataModelBase<Maybe<string | null>> {
  constructor(value: Maybe<string | null> | (() => Maybe<string | null>)) {
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
