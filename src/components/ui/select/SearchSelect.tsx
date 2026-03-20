import * as PopoverPrimitive from "@radix-ui/react-popover";
import { Check } from "lucide-react";
import * as React from "react";

import { cn } from "../cn";
import { useAsyncSelect } from "./hooks";
import {
  SelectEmpty,
  SelectLoading,
  SelectTriggerIcon,
} from "./primitives";
import {
  selectContentClasses,
  selectItemClasses,
  selectItemHighlightedClasses,
  selectTriggerVariants,
} from "./selectVariants";
import {
  type SelectOption,
  type SelectRootProps,
  type SelectTriggerAppearance,
} from "./types";

export interface SearchSelectProps<TData, TValue extends string = string>
  extends SelectTriggerAppearance,
    Pick<
      SelectRootProps<TValue>,
      "value" | "defaultValue" | "onValueChange" | "disabled"
    > {
  /** Fetches options. Receives current query string and AbortSignal. */
  fetchOptions: (query: string, signal?: AbortSignal) => Promise<TData[]>;
  /** Maps a raw item to a SelectOption. */
  getOption: (item: TData) => SelectOption<TValue>;
  /** Fetch immediately on mount. Default: false. */
  fetchOnMount?: boolean;
  /** Debounce delay in ms for re-fetches while typing. Default: 300. */
  searchDebounce?: number;
  /** Shown when the loaded list is empty. */
  empty?: React.ReactNode;
}

export const SearchSelect = <TData, TValue extends string = string>({
  fetchOptions,
  getOption,
  fetchOnMount,
  searchDebounce,
  placeholder,
  empty,
  triggerSize,
  triggerVariant,
  triggerClassName,
  clearable,
  onClear,
  value,
  onValueChange,
  disabled,
}: SearchSelectProps<TData, TValue>) => {
  const [open, setOpen] = React.useState(false);
  const [focusedIndex, setFocusedIndex] = React.useState(-1);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const listRef = React.useRef<HTMLDivElement>(null);

  const { options, loading, handleOpenChange, query, setQuery } =
    useAsyncSelect<TData, TValue>({
      fetchOptions,
      getOption,
      fetchOnMount,
      search: true,
      searchDebounce,
    });

  const selectedOption = React.useMemo(
    () => options.find(o => o.value === value),
    [options, value],
  );

  // Persist selected label even when filtered out of current options
  const [selectedLabel, setSelectedLabel] = React.useState<string | undefined>(
    () => (selectedOption ? String(selectedOption.label) : undefined),
  );

  React.useEffect(() => {
    if (!value) {
      setSelectedLabel(undefined);

      return;
    }
    if (selectedOption) setSelectedLabel(String(selectedOption.label));
  }, [value, selectedOption]);

  const handleOpen = React.useCallback(
    (nextOpen: boolean) => {
      setOpen(nextOpen);
      handleOpenChange(nextOpen);
      if (nextOpen) {
        setFocusedIndex(-1);
        setTimeout(() => inputRef.current?.focus(), 0);
      } else {
        setQuery("");
        setFocusedIndex(-1);
      }
    },
    [handleOpenChange, setQuery],
  );

  const handleSelect = React.useCallback(
    (optValue: TValue) => {
      onValueChange?.(optValue);
      handleOpen(false);
    },
    [onValueChange, handleOpen],
  );

  const handleClear = React.useCallback(() => {
    setQuery("");
    onValueChange?.(undefined as unknown as TValue);
    onClear?.();
  }, [onValueChange, onClear, setQuery]);

  const handleKeyDown = React.useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setFocusedIndex(i => Math.min(i + 1, options.length - 1));
          break;
        case "ArrowUp":
          e.preventDefault();
          setFocusedIndex(i => Math.max(i - 1, 0));
          break;
        case "Enter":
          e.preventDefault();
          if (focusedIndex >= 0 && options[focusedIndex]) {
            handleSelect(options[focusedIndex].value as TValue);
          }
          break;
        case "Escape":
          e.preventDefault();
          handleOpen(false);
          break;
        case "Tab":
          handleOpen(false);
          break;
      }
    },
    [options, focusedIndex, handleSelect, handleOpen],
  );

  // Scroll focused item into view
  React.useEffect(() => {
    if (focusedIndex < 0 || !listRef.current) return;
    const item = listRef.current.children[focusedIndex] as
      | HTMLElement
      | undefined;

    item?.scrollIntoView({ block: "nearest" });
  }, [focusedIndex]);

  // Reset focused index when options change
  React.useEffect(() => {
    setFocusedIndex(-1);
  }, [options]);

  const showClear = clearable && !!value && !loading;

  return (
    <PopoverPrimitive.Root open={open} onOpenChange={handleOpen}>
      <PopoverPrimitive.Trigger asChild disabled={disabled}>
        <div
          className={cn(
            selectTriggerVariants({ size: triggerSize, variant: triggerVariant }),
            "cursor-text",
            disabled && "pointer-events-none opacity-50",
            triggerClassName,
          )}
        >
          <input
            ref={inputRef}
            className="flex-1 min-w-0 bg-transparent outline-none text-inherit placeholder:text-muted-foreground cursor-text"
            value={open ? query : (selectedLabel ?? "")}
            placeholder={
              open
                ? (selectedLabel ?? placeholder)
                : value
                  ? undefined
                  : placeholder
            }
            readOnly={!open}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            onPointerDown={e => {
              if (open) {
                // Prevent PopoverTrigger from toggling (closing) while interacting with the input
                e.stopPropagation();
              }
              // When closed: let event bubble to PopoverTrigger — it opens naturally
            }}
          />

          <SelectTriggerIcon
            loading={loading}
            showClear={showClear}
            onClear={handleClear}
          />
        </div>
      </PopoverPrimitive.Trigger>

      <PopoverPrimitive.Portal>
        <PopoverPrimitive.Content
          align="start"
          sideOffset={4}
          // Prevent focus from moving into popover content — keep it in the trigger input
          onOpenAutoFocus={e => e.preventDefault()}
          onInteractOutside={e => {
            // Don't close when clicking inside the trigger (input handles that)
            if (
              inputRef.current &&
              e.target instanceof Node &&
              inputRef.current
                .closest("[data-radix-popover-trigger]")
                ?.contains(e.target)
            ) {
              e.preventDefault();
            }
          }}
          className={cn(
            selectContentClasses,
            "w-[var(--radix-popover-trigger-width)] max-h-60",
          )}
        >
          <div
            ref={listRef}
            className="overflow-y-auto max-h-60 p-1"
            role="listbox"
          >
            {loading ? (
              <SelectLoading />
            ) : options.length === 0 ? (
              <SelectEmpty>{empty}</SelectEmpty>
            ) : (
              options.map((opt, index) => (
                <div
                  key={opt.value}
                  role="option"
                  aria-selected={opt.value === value}
                  className={cn(
                    selectItemClasses,
                    "hover:bg-accent hover:text-accent-foreground",
                    index === focusedIndex && selectItemHighlightedClasses,
                    opt.disabled && "pointer-events-none opacity-50",
                  )}
                  onMouseEnter={() => setFocusedIndex(index)}
                  onMouseLeave={() => setFocusedIndex(-1)}
                  // Prevent input blur when clicking an item
                  onPointerDown={e => e.preventDefault()}
                  onClick={() =>
                    !opt.disabled && handleSelect(opt.value as TValue)
                  }
                >
                  <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
                    {opt.value === value && <Check className="h-4 w-4" />}
                  </span>
                  {opt.label}
                </div>
              ))
            )}
          </div>
        </PopoverPrimitive.Content>
      </PopoverPrimitive.Portal>
    </PopoverPrimitive.Root>
  );
};

SearchSelect.displayName = "SearchSelect";
