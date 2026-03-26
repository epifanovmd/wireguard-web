import { isFunction } from "./typeGuards";

export type LambdaValue<TValue, TArgs = unknown> =
  | TValue
  | ((args?: TArgs) => TValue);

export const resolveLambdaValue = <TValue, TArgs = unknown>(
  value: LambdaValue<TValue>,
  args?: TArgs,
): TValue => (isFunction(value) ? value(args) : value);
