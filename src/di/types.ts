export type InitializeDispose =
  | void
  | (() => void)
  | (() => void)[]
  | Promise<void | (() => void) | (() => void)[]>;

export interface SupportInitialize<T = undefined> {
  initialize: T extends undefined
    ? () => InitializeDispose
    : (data: T) => InitializeDispose;
}

export type Maybe<T> = T | undefined;
