import { DataModelBase, Maybe } from "@force-dev/utils";

import { formatter } from "~@common";

export class DateModel extends DataModelBase<Maybe<string>> {
  public get formatted() {
    const dateTime = this.data && new Date(this.data).toISOString();
    const split = dateTime?.split("T");

    if (split) {
      return `${split[0]} / ${split[1]?.split(".")[0]}`;
    }

    return "";
  }

  public get formattedDiff() {
    const dateTime = this.data && new Date(this.data);

    return dateTime && formatter.date.diff(dateTime);
  }
}
