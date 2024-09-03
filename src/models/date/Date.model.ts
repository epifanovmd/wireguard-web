import { DataModelBase, Maybe } from "@force-dev/utils";

export class DateModel extends DataModelBase<Maybe<string>> {
  public get formatted() {
    const dateTime = this.data && new Date(this.data).toISOString();
    const split = dateTime?.split("T");

    if (split) {
      return `${split[0]} / ${split[1]?.split(".")[0]}`;
    }

    return "";
  }
}
