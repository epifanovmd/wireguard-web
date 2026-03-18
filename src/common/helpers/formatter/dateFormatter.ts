import {
  differenceInDays,
  differenceInHours,
  differenceInMinutes,
  format,
  isAfter,
  isToday,
  parseISO,
} from "date-fns";

import { pluralizeDay, pluralizeHour, pluralizeMinute } from "../pluralize";

type MaybeString = string | null | undefined;

export class DateFormatter {
  /** "d MMMM yyyy, HH:mm" */
  format = (isoString: MaybeString): string => {
    if (!isoString) return "";

    return format(parseISO(isoString), "d MMMM yyyy, HH:mm");
  };

  /** "d MMMM yyyy" */
  formatDate = (isoString: MaybeString): string => {
    if (!isoString) return "";

    return format(parseISO(isoString), "d MMMM yyyy");
  };

  /** "HH:mm:ss" */
  formatTime = (isoString: MaybeString): string => {
    if (!isoString) return "";

    return format(parseISO(isoString), "HH:mm:ss");
  };

  /** "yyyy-MM-dd" (для HTML date input) */
  formatInputDate = (isoString: MaybeString): string => {
    if (!isoString) return "";

    return format(parseISO(isoString), "yyyy-MM-dd");
  };

  /** Относительное время: "3 минуты назад", "вчера", "2 дня назад" */
  formatDiff = (isoString: MaybeString): string => {
    if (!isoString) return "";

    const date = parseISO(isoString);
    const now = new Date();

    if (isToday(date)) {
      const minutes = differenceInMinutes(now, date);

      if (minutes < 1) return "только что";
      if (minutes < 60) return `${pluralizeMinute(minutes, true)} назад`;

      const hours = differenceInHours(now, date);

      return `${pluralizeHour(hours, true)} назад`;
    }

    const days = differenceInDays(now, date);

    if (days === 1) return "вчера";
    if (days < 7) return `${pluralizeDay(days, true)} назад`;

    return format(date, "d MMMM yyyy");
  };

  /** true если дата уже прошла */
  isExpired = (isoString: MaybeString): boolean => {
    if (!isoString) return false;

    return isAfter(new Date(), parseISO(isoString));
  };
}
