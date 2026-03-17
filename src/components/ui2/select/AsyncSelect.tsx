import * as SelectPrimitive from "@radix-ui/react-select";
import * as React from "react";

import { useAsyncSelect } from "./hooks";
import {
  SelectContent,
  SelectEmpty,
  SelectItem,
  SelectLoading,
  SelectTrigger,
} from "./primitives";
import {
  type SelectOption,
  type SelectRootProps,
  type SelectTriggerAppearance,
} from "./types";

export interface AsyncSelectProps<TData, TValue extends string = string>
  extends SelectRootProps<TValue>,
    SelectTriggerAppearance {
  /** Function that returns a Promise with raw data. Called on first open (or on mount if fetchOnMount=true). */
  fetchOptions: (signal?: AbortSignal) => Promise<TData[]>;
  /** Maps a raw data item to a SelectOption. */
  getOption: (item: TData) => SelectOption<TValue>;
  /** Fetch immediately on mount. Default: false (lazy — fetches on first open). */
  fetchOnMount?: boolean;
  /** Shown when loaded options list is empty. */
  empty?: React.ReactNode;
  /** Called when the dropdown opens/closes (in addition to internal fetch logic). */
  onOpenChange?: (open: boolean) => void;
}

export const AsyncSelect = <TData, TValue extends string = string>({
  fetchOptions,
  getOption,
  fetchOnMount,
  placeholder,
  empty,
  triggerSize,
  triggerClassName,
  onOpenChange,
  value,
  defaultValue,
  onValueChange,
  ...props
}: AsyncSelectProps<TData, TValue>) => {
  const { options, loading, handleOpenChange } = useAsyncSelect<TData, TValue>({
    fetchOptions,
    getOption,
    fetchOnMount,
  });

  const handleOpen = React.useCallback(
    (open: boolean) => {
      handleOpenChange(open);
      onOpenChange?.(open);
    },
    [handleOpenChange, onOpenChange],
  );

  return (
    <SelectPrimitive.Root
      value={value}
      defaultValue={defaultValue}
      onValueChange={onValueChange as ((v: string) => void) | undefined}
      onOpenChange={handleOpen}
      {...props}
    >
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
    </SelectPrimitive.Root>
  );
};

AsyncSelect.displayName = "AsyncSelect";
