import { DataModelBase, Maybe } from "@force-dev/utils";
import {
  differenceInDays,
  differenceInHours,
  differenceInMinutes,
  format,
  isToday,
  parseISO,
} from "date-fns";

export class DateModel extends DataModelBase<Maybe<string>> {
  get formatted() {
    if (!this.data) return "";

    return format(parseISO(this.data), "d MMMM yyyy, HH:mm");
  }

  get formattedDate() {
    if (!this.data) return "";

    return format(parseISO(this.data), "d MMMM yyyy");
  }

  get formattedDiff() {
    if (!this.data) return "";

    const date = parseISO(this.data);
    const now = new Date();

    if (isToday(date)) {
      const minutes = differenceInMinutes(now, date);

      if (minutes < 1) return "только что";
      if (minutes < 60) return `${minutes} мин. назад`;

      const hours = differenceInHours(now, date);

      return `${hours} ч. назад`;
    }

    const days = differenceInDays(now, date);

    if (days === 1) return "вчера";
    if (days < 7) return `${days} дн. назад`;

    return format(date, "d MMMM yyyy");
  }
}
