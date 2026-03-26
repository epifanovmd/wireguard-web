export const isString = <U>(term: string | U): term is string =>
  typeof term === "string";

export const isFunction = <T extends Function, U>(term: T | U): term is T =>
  typeof term === "function";

export const isArray = <T, U>(term: Array<T> | U): term is Array<T> =>
  Array.isArray(term);

export const isPromise = <T>(obj: any | Promise<T>): obj is Promise<T> =>
  !!obj &&
  (typeof obj === "object" || typeof obj === "function") &&
  typeof obj.then === "function";
