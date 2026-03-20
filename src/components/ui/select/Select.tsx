import * as PopoverPrimitive from "@radix-ui/react-popover";
import * as React from "react";

import { cn } from "../cn";
import { useKeyboardNav, useSelectOptions, useSelectState } from "./hooks";
import {
  SelectEmpty,
  SelectListItem,
  SelectLoading,
  SelectPopoverContent,
  SelectTag,
  SelectTriggerBase,
} from "./primitives";
import { type SelectOption, type SelectProps } from "./types";

// ─── Label cache ───────────────────────────────────────────────────────────────

function useLabelCache<V extends string>() {
  const cacheRef = React.useRef<Partial<Record<string, React.ReactNode>>>({});

  const updateCache = React.useCallback((opts: SelectOption<V>[]) => {
    opts.forEach(o => {
      cacheRef.current[o.value] = o.label;
    });
  }, []);

  const getLabel = React.useCallback(
    (v: V): React.ReactNode => cacheRef.current[v] ?? v,
    [],
  );

  return { updateCache, getLabel };
}

// ─── Select ────────────────────────────────────────────────────────────────────

export function Select<TData = unknown, V extends string = string>(
  props: SelectProps<TData, V>,
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

  React.useEffect(() => {
    updateCache(options);
  }, [options, updateCache]);

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
    ? ((rawValue as V[] | undefined) ?? []).length > 0
    : rawValue != null && rawValue !== "";

  const showClear = clearable && !loading && hasValue;

  // ─── Trigger content ───────────────────────────────────────────────────────

  const renderInput = () => (
    <input
      ref={inputRef}
      className="flex-1 min-w-0 bg-transparent outline-none text-inherit placeholder:text-muted-foreground cursor-text text-sm"
      value={open ? query : ""}
      placeholder={selectedValues.length === 0 ? placeholder : undefined}
      readOnly={!open}
      onChange={e => setQuery(e.target.value)}
      onKeyDown={handleKeyDown}
      onPointerDown={e => {
        if (open) e.stopPropagation();
      }}
    />
  );

  const renderTriggerContent = () => {
    // ── Multi + search ─────────────────────────────────────────────────────
    if (multi && search) {
      return (
        <div className="flex flex-wrap gap-1 flex-1 min-w-0 overflow-hidden items-center py-0.5">
          {selectedValues.map(v => (
            <SelectTag
              key={v}
              label={getLabel(v)}
              onRemove={() => handleRemoveTag(v)}
              disabled={disabled}
            />
          ))}
          {renderInput()}
        </div>
      );
    }

    // ── Single + search ────────────────────────────────────────────────────
    if (search) {
      const displayLabel = hasValue
        ? String(getLabel(rawValue as V))
        : undefined;

      return (
        <input
          ref={inputRef}
          className="flex-1 min-w-0 bg-transparent outline-none text-inherit placeholder:text-muted-foreground cursor-text text-sm"
          value={open ? query : (displayLabel ?? "")}
          placeholder={
            open
              ? (displayLabel ?? placeholder)
              : hasValue
                ? undefined
                : placeholder
          }
          readOnly={!open}
          onChange={e => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onPointerDown={e => {
            if (open) e.stopPropagation();
          }}
        />
      );
    }

    // ── Multi, no search ───────────────────────────────────────────────────
    if (multi) {
      const vals = (rawValue as V[] | undefined) ?? [];
      if (vals.length === 0) {
        return (
          <span className="flex-1 truncate text-muted-foreground text-sm">
            {placeholder}
          </span>
        );
      }
      if (tagsDisplay) {
        return (
          <div className="flex flex-wrap gap-1 flex-1 min-w-0 overflow-hidden py-0.5">
            {vals.map(v => (
              <SelectTag
                key={v}
                label={getLabel(v)}
                onRemove={() => handleRemoveTag(v)}
                disabled={disabled}
              />
            ))}
          </div>
        );
      }
      return (
        <span className="flex-1 truncate text-sm">
          {vals.map(v => String(getLabel(v))).join(", ")}
        </span>
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

Select.displayName = "Select";
