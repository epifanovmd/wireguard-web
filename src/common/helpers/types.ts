export type CheckArray<T> = T extends any[] ? T[number] : T;

export type PartialObject<T> = T extends object ? Partial<T> : T;

export type SubType<Base, Condition> = Pick<
  Base,
  {
    [Key in keyof Base]: Base[Key] extends Condition ? Key : never;
  }[keyof Base]
>;

export type Join<K, P> = K extends string | number
  ? P extends string | number
    ? `${K}${"" extends P ? "" : "."}${P}`
    : never
  : never;

export type RecursiveObjectType<T, D extends number = 10> = [D] extends [never]
  ? never
  : T extends object
  ? {
      [K in keyof T]-?: K extends string | number
        ? `${K}` | Join<K, RecursiveObjectType<T[K]>>
        : never;
    }[keyof T]
  : "";

export type PartialKeys<T, K extends keyof T> = Omit<T, K> &
  Partial<Pick<T, K>>;
export type RequiredKeys<T, K extends keyof T> = Omit<T, K> &
  Required<Pick<T, K>>;

export interface IEmpty {
  [key: string]: any;
  [key: number]: any;
}

export type Maybe<T> = T | undefined;

export type InitializeDispose =
  | void
  | (() => void)
  | (() => void)[]
  | Promise<void | (() => void) | (() => void)[]>;
export interface SupportInitialize<T = unknown> {
  initialize: (data: T) => InitializeDispose;
}
