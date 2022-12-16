export interface PluralOptions {
  one: string;
  two: string;
  five: string;
}

export const camelize = (str: string) =>
  str.replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, (match, index) => {
    if (+match === 0) {
      return "";
    }

    return index === 0 ? match.toLowerCase() : match.toUpperCase();
  });

export const stringCapitalize = (str: string): string =>
  (str?.length || 0) > 0 ? str[0].toUpperCase() + str.slice(1) : str;

export const stringUnCapitalize = (str: string): string =>
  (str?.length || 0) > 0 ? str[0].toLowerCase() + str.slice(1) : str;

export function pluralize(
  count: number,
  plurals: PluralOptions,
  withNumber?: boolean,
  hideZero?: boolean,
) {
  const { one, two, five = two } = plurals;

  if (count === 0 && hideZero) {
    return "";
  }
  let plural = Math.floor(Math.abs(count)) % 100;

  if (plural > 10 && plural < 20) {
    return withNumber ? `${count} ${five}` : five;
  }

  plural %= 10;

  if (1 === plural) {
    return withNumber ? `${count} ${one}` : one;
  }

  if (plural >= 2 && plural <= 4) {
    return withNumber ? `${count} ${two}` : two;
  }

  return withNumber ? `${count} ${five}` : five;
}
