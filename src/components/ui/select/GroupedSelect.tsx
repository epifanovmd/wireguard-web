import * as React from "react";

import { SelectListGroup, SelectListItem } from "./primitives";
import { Select } from "./Select";
import { type GroupedSelectProps, type SelectOption } from "./types";

export { GroupedSelectProps };

export function GroupedSelect<V extends string = string>(
  props: GroupedSelectProps<V>,
): React.ReactElement {
  const { groups = [], ...rest } = props;

  const flatOptions = React.useMemo<SelectOption<V>[]>(
    () => groups.flatMap(g => g.options as SelectOption<V>[]),
    [groups],
  );

  return (
    <Select<unknown, V>
      {...(rest as any)}
      options={flatOptions}
      renderOptions={({
        focusedIndex,
        setFocusedIndex,
        isSelected,
        onSelect,
      }) =>
        groups.map(group => (
          <SelectListGroup key={group.group} label={group.group}>
            {group.options.map(opt => {
              const flatIdx = flatOptions.indexOf(opt as SelectOption<V>);

              return (
                <SelectListItem
                  key={opt.value}
                  selected={isSelected(opt.value as V)}
                  focused={flatIdx === focusedIndex}
                  disabled={opt.disabled}
                  onSelect={() => onSelect(opt.value as V)}
                  onFocus={() => setFocusedIndex(flatIdx)}
                  onBlur={() => setFocusedIndex(-1)}
                >
                  {opt.label}
                </SelectListItem>
              );
            })}
          </SelectListGroup>
        ))
      }
    />
  );
}

GroupedSelect.displayName = "GroupedSelect";
