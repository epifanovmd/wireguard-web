export const stringCapitalize = (str: string): string =>
  (str?.length || 0) > 0 ? str[0].toUpperCase() + str.slice(1) : str;

export const stringUnCapitalize = (str: string): string =>
  (str?.length || 0) > 0 ? str[0].toLowerCase() + str.slice(1) : str;
