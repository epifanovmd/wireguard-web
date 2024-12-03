import { pluralize } from "@force-dev/utils";

export const pluralizeDay = (
  count: number,
  includeNumber = false,
  hideZero = false,
): string => {
  return pluralize(
    count,
    {
      one: "день",
      few: "дня",
      many: "дней",
    },
    includeNumber,
    hideZero,
  );
};

export const pluralizeHour = (
  count: number,
  includeNumber = false,
  hideZero = false,
): string => {
  return pluralize(
    count,
    {
      one: "час",
      few: "часа",
      many: "часов",
    },
    includeNumber,
    hideZero,
  );
};

export const pluralizeMinute = (
  count: number,
  includeNumber = false,
  hideZero = false,
): string => {
  return pluralize(
    count,
    {
      one: "минуту",
      few: "минуты",
      many: "минут",
    },
    includeNumber,
    hideZero,
  );
};
