export function assertNotNull<T>(
  item: T | null | undefined,
  message?: string,
): T {
  if (item === null || item === undefined) {
    throw new Error(`Object can not be null. ${message ? message : ""}`);
  }

  return item;
}

export const isUndefined = <T>(term: T | undefined): term is undefined =>
  typeof term === "undefined";

export const isBoolean = <U>(term: boolean | U): term is boolean =>
  typeof term === "boolean";

export const isNumber = <U>(term: number | U): term is number =>
  typeof term === "number" && !Number.isNaN(term);

export const isString = <U>(term: string | U): term is string =>
  typeof term === "string";

export const isBigInt = <U>(term: bigint | U): term is bigint =>
  typeof term === "bigint";

export const isSymbol = <U>(term: symbol | U): term is symbol =>
  typeof term === "symbol";

export const isNull = <T>(term: T | null): term is null => term === null;

export const isFunction = <T extends Function, U>(term: T | U): term is T =>
  typeof term === "function";

export const isObject = <T extends object, U>(
  term: T | U,
): term is NonNullable<T> => !isNull(term) && typeof term === "object";

export const isArray = <T, U>(term: Array<T> | U): term is Array<T> =>
  Array.isArray(term);

export const isMap = <K, V, U>(term: Map<K, V> | U): term is Map<K, V> =>
  term instanceof Map;

export const isSet = <T, U>(term: Set<T> | U): term is Set<T> =>
  term instanceof Set;

export const isWeakMap = <K extends object, V, U>(
  term: WeakMap<K, V> | U,
): term is WeakMap<K, V> => term instanceof WeakMap;

export const isWeakSet = <T extends object, U>(
  term: WeakSet<T> | U,
): term is WeakSet<T> => term instanceof WeakSet;

export const isDate = <U>(term: Date | U): term is Date => term instanceof Date;

export const isObjectOrNull = <T extends object, U>(term: T | U): term is T =>
  typeof term === "object";

export const isNonEmptyArray = <T, U>(term: Array<T> | U): term is Array<T> =>
  isArray(term) && term.length > 0;

export const isNonEmptyString = <U>(term: string | U): term is string =>
  isString(term) && term.length > 0;

export const isNumberOrNaN = <U>(term: number | U): term is number =>
  typeof term === "number";

export const isInteger = <U>(term: number | U): term is number =>
  isNumber(term) && Number.isInteger(term);

export const isPositiveInteger = <U>(term: number | U): term is number =>
  isInteger(term) && term > 0;

export const isNonNegativeInteger = <U>(term: number | U): term is number =>
  isInteger(term) && term >= 0;

export const isNegativeInteger = <U>(term: number | U): term is number =>
  isInteger(term) && term < 0;
