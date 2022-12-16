import { isFunction } from "./typeGuards.hekper";

export type LambdaValueHelper<TValue, TArgs = unknown> =
  | TValue
  | ((args?: TArgs) => TValue);

export const resolveLambdaValue = <TValue, TArgs = unknown>(
  value: LambdaValueHelper<TValue>,
  args?: TArgs,
): TValue => (isFunction(value) ? value(args) : value);
