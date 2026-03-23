import * as PopoverPrimitive from "@radix-ui/react-popover";
import * as React from "react";
import { ComponentPropsWithRef } from "react";

import { cn } from "../cn";
import {
  useKeyboardNav,
  useLabelCache,
  useSelectOptions,
  useSelectState,
} from "./hooks";
import {
  SelectEmpty,
  SelectListItem,
  SelectLoading,
  SelectPopoverContent,
  SelectTag,
  SelectTriggerBase,
} from "./primitives";
import { type SelectProps } from "./types";

// ─── Select ────────────────────────────────────────────────────────────────────

export interface SelectHandle {
  focus(): void;
}

function SelectInner<TData = unknown, V extends string = string>(
  props: SelectProps<TData, V>,
  ref: React.ForwardedRef<SelectHandle>,
): React.ReactElement {
  const {
    options: optionsProp,
    fetchOptions,
    getOption,
    fetchOnMount,
    loadOnce,
    debounce,
    search,
    loading: loadingProp,
    disabled,
    placeholder,
    empty,
    size,
    variant,
    className,
    onOpenChange: onOpenChangeProp,
    renderOptions,
  } = props;

  const multi = props.multi === true;
  const clearable = props.clearable === true;
  const tagsDisplay = !multi || props.tagsDisplay !== false;

  const rawValue = props.value;
  const onChange = props.onChange as
    | ((v: V) => void)
    | ((v: V | null) => void)
    | ((v: V[]) => void)
    | undefined;

  const inputRef = React.useRef<HTMLInputElement>(null);
  const triggerRef = React.useRef<HTMLDivElement>(null);

  React.useImperativeHandle(ref, () => ({
    focus() {
      if (search) {
        handleOpen(true);
        inputRef.current?.focus();
      } else {
        triggerRef.current?.focus();
      }
    },
  }));

  const { open, query, setQuery, handleOpen } = useSelectState(search);

  const { options, loading: optionsLoading } = useSelectOptions<TData, V>({
    options: optionsProp,
    fetchOptions,
    getOption,
    fetchOnMount,
    loadOnce,
    debounce,
    search,
    query,
    open,
  });

  const loading = loadingProp ?? optionsLoading;

  const { updateCache, getLabel } = useLabelCache<V>();

  React.useMemo(() => {
    updateCache(options);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [options]);

  // Normalize value to array for uniform handling
  const selectedValues = React.useMemo<V[]>(
    () =>
      multi
        ? ((rawValue as V[] | undefined) ?? [])
        : rawValue != null
          ? [rawValue as V]
          : [],
    [multi, rawValue],
  );

  const isSelected = React.useCallback(
    (v: V) => selectedValues.includes(v),
    [selectedValues],
  );

  // ─── Handlers ─────────────────────────────────────────────────────────────

  const handleSelect = React.useCallback(
    (optValue: V) => {
      if (multi) {
        const cur = (rawValue as V[] | undefined) ?? [];
        const next = cur.includes(optValue)
          ? cur.filter(v => v !== optValue)
          : [...cur, optValue];
        (onChange as (v: V[]) => void)?.(next);
        // Multi: don't close on select
      } else {
        (onChange as (v: V) => void)?.(optValue);
        handleOpen(false, inputRef);
      }
    },
    [multi, rawValue, onChange, handleOpen],
  );

  const handleClear = React.useCallback(() => {
    if (multi) {
      (onChange as (v: V[]) => void)?.([]);
    } else {
      (onChange as (v: V | null) => void)?.(null);
    }
    setQuery("");
    handleOpen(false, inputRef);
  }, [multi, onChange, setQuery, handleOpen]);

  const handleRemoveTag = React.useCallback(
    (v: V) => {
      if (!multi) return;
      const cur = (rawValue as V[] | undefined) ?? [];
      (onChange as (v: V[]) => void)?.(cur.filter(x => x !== v));
    },
    [multi, rawValue, onChange],
  );

  // ─── Keyboard nav ──────────────────────────────────────────────────────────

  const { focusedIndex, setFocusedIndex, handleKeyDown, listRef } =
    useKeyboardNav({
      count: options.length,
      onSelect: i => handleSelect(options[i].value as V),
      onClose: () => handleOpen(false, inputRef),
    });

  const hasValue = multi
    ? selectedValues.length > 0
    : rawValue != null && rawValue !== "";

  const showClear = clearable && !loading && hasValue;

  // ─── Trigger content ───────────────────────────────────────────────────────

  const searchInputProps: ComponentPropsWithRef<"input"> = {
    ref: inputRef,
    className:
      "flex-1 min-w-0 bg-transparent outline-none text-inherit placeholder:text-muted-foreground cursor-text text-sm",
    readOnly: !open,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
      setQuery(e.target.value),
    onKeyDown: handleKeyDown,
    onPointerDown: (e: React.PointerEvent) => {
      if (open) e.stopPropagation();
    },
  };

  const renderTriggerContent = () => {
    // ── Multi ──────────────────────────────────────────────────────────────
    if (multi) {
      const vals = selectedValues;

      if (tagsDisplay) {
        // No values + no search → plain placeholder span
        if (!search && vals.length === 0) {
          return (
            <span className="flex-1 truncate text-sm text-muted-foreground">
              {placeholder}
            </span>
          );
        }
        // Tags (+ search input when enabled)
        return (
          <div className="flex flex-wrap gap-1 flex-1 min-w-0 overflow-hidden items-center py-0.5">
            {vals.map(v => (
              <SelectTag
                key={v}
                label={getLabel(v)}
                onRemove={() => handleRemoveTag(v)}
                disabled={disabled}
              />
            ))}
            {search && (
              <input
                {...searchInputProps}
                value={open ? query : ""}
                placeholder={vals.length === 0 ? placeholder : undefined}
              />
            )}
          </div>
        );
      }

      // Comma-separated — same pattern as single + search:
      // closed → comma text as value; open → search query, comma text as placeholder
      const commaLabel =
        vals.length > 0
          ? vals.map(v => String(getLabel(v))).join(", ")
          : undefined;

      if (search) {
        return (
          <input
            {...searchInputProps}
            value={open ? query : (commaLabel ?? "")}
            placeholder={
              open
                ? (commaLabel ?? placeholder)
                : commaLabel
                  ? undefined
                  : placeholder
            }
          />
        );
      }

      return (
        <span
          className={cn(
            "flex-1 truncate text-sm",
            !commaLabel && "text-muted-foreground",
          )}
        >
          {commaLabel ?? placeholder}
        </span>
      );
    }

    // ── Single + search ────────────────────────────────────────────────────
    if (search) {
      const displayLabel = hasValue
        ? String(getLabel(rawValue as V))
        : undefined;

      return (
        <input
          {...searchInputProps}
          value={open ? query : (displayLabel ?? "")}
          placeholder={
            open
              ? (displayLabel ?? placeholder)
              : hasValue
                ? undefined
                : placeholder
          }
        />
      );
    }

    // ── Single, no search ──────────────────────────────────────────────────
    return (
      <span
        className={cn(
          "flex-1 truncate text-sm",
          !hasValue && "text-muted-foreground",
        )}
      >
        {hasValue ? String(getLabel(rawValue as V)) : placeholder}
      </span>
    );
  };

  // ─── Open handler ──────────────────────────────────────────────────────────

  const handleOpenChange = React.useCallback(
    (nextOpen: boolean) => {
      handleOpen(nextOpen, inputRef);
      onOpenChangeProp?.(nextOpen);
    },
    [handleOpen, onOpenChangeProp],
  );

  // ─── Prevent popover close when clicking inside search trigger ─────────────

  const onInteractOutside = React.useCallback(
    (e: Event) => {
      if (!search) return;
      if (
        inputRef.current &&
        e.target instanceof Node &&
        inputRef.current
          .closest("[data-radix-popover-trigger]")
          ?.contains(e.target)
      ) {
        e.preventDefault();
      }
    },
    [search],
  );

  // ─── Non-search keyboard on trigger ───────────────────────────────────────

  const triggerKeyDown = !search ? handleKeyDown : undefined;

  // ─── Render ────────────────────────────────────────────────────────────────

  return (
    <PopoverPrimitive.Root open={open} onOpenChange={handleOpenChange}>
      <PopoverPrimitive.Trigger asChild disabled={disabled}>
        <SelectTriggerBase
          ref={triggerRef}
          size={size}
          variant={variant}
          className={className}
          loading={loading}
          showClear={showClear}
          onClear={handleClear}
          cursorText={search}
          tabIndex={!search ? 0 : undefined}
          onKeyDown={triggerKeyDown}
          data-disabled={disabled ? "" : undefined}
          style={disabled ? { pointerEvents: "none", opacity: 0.5 } : undefined}
        >
          {renderTriggerContent()}
        </SelectTriggerBase>
      </PopoverPrimitive.Trigger>

      <SelectPopoverContent onInteractOutside={onInteractOutside}>
        <div
          ref={listRef}
          className="overflow-y-auto max-h-60 p-1"
          role="listbox"
          aria-multiselectable={multi}
        >
          {loading ? (
            <SelectLoading />
          ) : options.length === 0 ? (
            <SelectEmpty>{empty}</SelectEmpty>
          ) : renderOptions ? (
            renderOptions({
              focusedIndex,
              setFocusedIndex,
              isSelected,
              onSelect: handleSelect,
            })
          ) : (
            options.map((opt, index) => (
              <SelectListItem
                key={opt.value}
                selected={isSelected(opt.value as V)}
                focused={index === focusedIndex}
                disabled={opt.disabled}
                onSelect={() => handleSelect(opt.value as V)}
                onFocus={() => setFocusedIndex(index)}
                onBlur={() => setFocusedIndex(-1)}
              >
                {opt.label}
              </SelectListItem>
            ))
          )}
        </div>
      </SelectPopoverContent>
    </PopoverPrimitive.Root>
  );
}

export const Select = React.forwardRef(SelectInner) as <
  TData = unknown,
  V extends string = string,
>(
  props: SelectProps<TData, V> & { ref?: React.Ref<SelectHandle> },
) => React.ReactElement;

(Select as { displayName?: string }).displayName = "Select";
