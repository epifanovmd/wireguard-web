import * as React from "react";

import { Select } from "./Select";
import { type AsyncSelectProps } from "./types";

export { AsyncSelectProps };

export const AsyncSelect = <TData, TValue extends string = string>(
  props: AsyncSelectProps<TData, TValue>,
): React.ReactElement => {
  const { onValueChange, ...rest } = props;
  return (
    <Select<TData, TValue>
      {...(rest as any)}
      onChange={onValueChange as any}
    />
  );
};

AsyncSelect.displayName = "AsyncSelect";
