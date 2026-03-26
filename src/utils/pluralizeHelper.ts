export type PluralParams = {
  zero?: string;
  one?: string;
  two?: string;
  few?: string;
  many?: string;
  [digit: `_${number}`]: string;
};

export const pluralize = (
  count: number,
  params: PluralParams,
  includeNumber: boolean = false,
  hideZero: boolean = false,
): string => {
  const mod10 = count % 10;
  const mod100 = count % 100;

  let result: string;

  if (params[`_${count}`] !== undefined) {
    result = params[`_${count}`]!;
  } else if (count === 0 && params.zero !== undefined) {
    result = params.zero;
  } else if (mod10 === 1 && mod100 !== 11 && params.one !== undefined) {
    result = params.one;
  } else if (
    mod10 === 2 &&
    mod100 !== 12 &&
    (params.two !== undefined || params.few !== undefined)
  ) {
    result = params.two ?? params.few!;
  } else if (
    mod10 >= 3 &&
    mod10 <= 4 &&
    !(mod100 >= 11 && mod100 <= 14) &&
    params.few !== undefined
  ) {
    result = params.few;
  } else if (params.many !== undefined) {
    result = params.many;
  } else {
    result = "";
  }

  const allowNumber = includeNumber && (!hideZero || count !== 0);

  return allowNumber ? `${count} ${result}` : result;
};
