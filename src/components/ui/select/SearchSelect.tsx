import * as React from "react";

import { Select } from "./Select";
import { type SearchSelectProps } from "./types";

export { SearchSelectProps };

export const SearchSelect = <TData, TValue extends string = string>(
  props: SearchSelectProps<TData, TValue>,
): React.ReactElement => {
  const { onValueChange, searchDebounce, ...rest } = props;
  return (
    <Select<TData, TValue>
      {...(rest as any)}
      search
      debounce={searchDebounce}
      onChange={onValueChange as any}
    />
  );
};

SearchSelect.displayName = "SearchSelect";
