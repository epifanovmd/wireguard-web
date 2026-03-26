type Join<K, P> = K extends string | number
  ? P extends string | number
    ? `${K}${"" extends P ? "" : "."}${P}`
    : never
  : never;

export type DeepKeys<T> = T extends object
  ? {
      [K in (string | number) & keyof T]: `${K}` | Join<K, DeepKeys<T[K]>>;
    }[(string | number) & keyof T]
  : never;

export type RecursiveObjectType<T> = DeepKeys<T>;
