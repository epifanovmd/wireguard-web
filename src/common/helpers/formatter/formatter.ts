import { DateFormatter } from "./dateFormatter";

class Formatter {
  get date() {
    return new DateFormatter();
  }
}

export const formatter = new Formatter();
