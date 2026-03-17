import * as SelectPrimitive from "@radix-ui/react-select";
import * as React from "react";

import {
  SelectContent,
  SelectEmpty,
  SelectItem,
  SelectLabel,
  SelectLoading,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectSeparator,
  SelectTrigger,
} from "./primitives";
import {
  type SelectOption,
  type SelectRootProps,
  type SelectTriggerAppearance,
} from "./types";

export interface SelectProps<TValue extends string = string>
  extends SelectRootProps<TValue>,
    SelectTriggerAppearance {
  /** Flat list of options. Triggers skeleton mode when provided. */
  options?: SelectOption<TValue>[];
  loading?: boolean;
  /** Shown when options is empty (not loading). */
  empty?: React.ReactNode;
}

const SelectRoot = <TValue extends string = string>({
  options,
  placeholder,
  loading,
  empty,
  triggerSize,
  triggerClassName,
  children,
  value,
  defaultValue,
  onValueChange,
  ...props
}: SelectProps<TValue>) => (
  <SelectPrimitive.Root
    value={value}
    defaultValue={defaultValue}
    onValueChange={onValueChange as ((v: string) => void) | undefined}
    {...props}
  >
    {options !== undefined ? (
      <>
        <SelectTrigger size={triggerSize} className={triggerClassName} loading={loading}>
          <SelectPrimitive.Value placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {loading ? (
            <SelectLoading />
          ) : options.length === 0 ? (
            <SelectEmpty>{empty}</SelectEmpty>
          ) : (
            options.map(opt => (
              <SelectItem key={opt.value} value={opt.value} disabled={opt.disabled}>
                {opt.label}
              </SelectItem>
            ))
          )}
        </SelectContent>
      </>
    ) : (
      children
    )}
  </SelectPrimitive.Root>
);

SelectRoot.displayName = "Select";

export const Select = Object.assign(SelectRoot, {
  Trigger: SelectTrigger,
  Content: SelectContent,
  Item: SelectItem,
  Group: SelectPrimitive.Group,
  Label: SelectLabel,
  Separator: SelectSeparator,
  Loading: SelectLoading,
  Empty: SelectEmpty,
  Value: SelectPrimitive.Value,
  ScrollUpButton: SelectScrollUpButton,
  ScrollDownButton: SelectScrollDownButton,
});
