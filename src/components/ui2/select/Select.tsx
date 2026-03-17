import * as SelectPrimitive from "@radix-ui/react-select";
import * as React from "react";

import { SelectContent } from "./SelectContent";
import { SelectEmpty } from "./SelectEmpty";
import { SelectItem } from "./SelectItem";
import { SelectLabel } from "./SelectLabel";
import { SelectLoading } from "./SelectLoading";
import { SelectScrollDownButton } from "./SelectScrollDownButton";
import { SelectScrollUpButton } from "./SelectScrollUpButton";
import { SelectSeparator } from "./SelectSeparator";
import { SelectTrigger, type SelectTriggerProps } from "./SelectTrigger";

// ─── Option types ────────────────────────────────────────────────────────────

export interface SelectOption {
  value: string;
  label: React.ReactNode;
  disabled?: boolean;
}

export interface SelectOptionGroup {
  group: string;
  options: SelectOption[];
}

export type SelectOptions = SelectOption[] | SelectOptionGroup[];

const isGrouped = (opts: SelectOptions): opts is SelectOptionGroup[] =>
  opts.length > 0 && "group" in opts[0];

// ─── Props ───────────────────────────────────────────────────────────────────

export interface SelectProps
  extends React.ComponentPropsWithoutRef<typeof SelectPrimitive.Root> {
  /** Skeleton mode — renders trigger + content automatically when provided. */
  options?: SelectOptions;
  placeholder?: string;
  loading?: boolean;
  /** Shown when options is empty and not loading. */
  empty?: React.ReactNode;

  // Trigger appearance (skeleton mode only)
  triggerSize?: SelectTriggerProps["size"];
  triggerClassName?: string;
}

// ─── Component ───────────────────────────────────────────────────────────────

const SelectRoot = ({
  options,
  placeholder,
  loading,
  empty,
  triggerSize,
  triggerClassName,
  children,
  ...props
}: SelectProps) => {
  const isSkeletonMode = options !== undefined;

  return (
    <SelectPrimitive.Root {...props}>
      {isSkeletonMode ? (
        <>
          <SelectTrigger size={triggerSize} className={triggerClassName} loading={loading}>
            <SelectPrimitive.Value placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent>
            {loading ? (
              <SelectLoading />
            ) : options.length === 0 ? (
              <SelectEmpty>{empty}</SelectEmpty>
            ) : isGrouped(options) ? (
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
};

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
