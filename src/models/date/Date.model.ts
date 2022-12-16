import { DataModelBase } from "../../common";

export class DateModel extends DataModelBase<Date> {
  public get formatted() {
    const dateTime = new Date(this.data).toISOString();
    const split = dateTime.split("T");

    return `${split[0]} -- ${split[1]?.split(".")[0]}`;
  }
}
