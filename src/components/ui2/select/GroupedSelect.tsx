import * as SelectPrimitive from "@radix-ui/react-select";
import * as React from "react";

import {
  SelectContent,
  SelectEmpty,
  SelectItem,
  SelectLabel,
  SelectLoading,
  SelectTrigger,
} from "./primitives";
import {
  type SelectOptionGroup,
  type SelectRootProps,
  type SelectTriggerAppearance,
} from "./types";

export interface GroupedSelectProps<TValue extends string = string>
  extends SelectRootProps<TValue>,
    SelectTriggerAppearance {
  /** Grouped options. Each group has a label and a list of options. */
  options: SelectOptionGroup<TValue>[];
  loading?: boolean;
  /** Shown when all groups are empty (not loading). */
  empty?: React.ReactNode;
}

export const GroupedSelect = <TValue extends string = string>({
  options,
  placeholder,
  loading,
  empty,
  triggerSize,
  triggerClassName,
  value,
  defaultValue,
  onValueChange,
  ...props
}: GroupedSelectProps<TValue>) => {
  const isEmpty = options.every(g => g.options.length === 0);

  return (
    <SelectPrimitive.Root
      value={value}
      defaultValue={defaultValue}
      onValueChange={onValueChange as ((v: string) => void) | undefined}
      {...props}
    >
      <SelectTrigger size={triggerSize} className={triggerClassName} loading={loading}>
        <SelectPrimitive.Value placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {loading ? (
          <SelectLoading />
        ) : isEmpty ? (
          <SelectEmpty>{empty}</SelectEmpty>
        ) : (
          options.map(group => (
            <SelectPrimitive.Group key={group.group}>
              <SelectLabel>{group.group}</SelectLabel>
              {group.options.map(opt => (
                <SelectItem key={opt.value} value={opt.value} disabled={opt.disabled}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectPrimitive.Group>
          ))
        )}
      </SelectContent>
    </SelectPrimitive.Root>
  );
};

GroupedSelect.displayName = "GroupedSelect";
