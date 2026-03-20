import { VariantProps } from "class-variance-authority";
import * as React from "react";

import { selectTriggerVariants } from "./selectVariants";

// ─── Option types ──────────────────────────────────────────────────────────────

export interface SelectOption<V extends string = string> {
  value: V;
  label: React.ReactNode;
  disabled?: boolean;
}

export interface SelectOptionGroup<V extends string = string> {
  group: string;
  options: SelectOption<V>[];
}

// ─── Options source types ──────────────────────────────────────────────────────

/** Static array of options */
export type SelectOptionsArray<V extends string = string> = SelectOption<V>[];

/** Sync getter — called with the current search query */
export type SelectOptionsGetter<V extends string = string> = (
  query: string,
) => SelectOption<V>[];

/** Async fetcher — called with query and optional AbortSignal */
export type SelectOptionsFetcher<TData = unknown> = (
  query: string,
  signal?: AbortSignal,
) => Promise<TData[]>;

// ─── Trigger appearance (no "trigger" prefix in the new API) ──────────────────

export interface SelectTriggerAppearance
  extends VariantProps<typeof selectTriggerVariants> {
  placeholder?: string;
  /** className applied to the trigger element */
  className?: string;
}

// ─── Custom list renderer ──────────────────────────────────────────────────────

export interface RenderOptionsContext<V extends string = string> {
  focusedIndex: number;
  setFocusedIndex: (index: number) => void;
  isSelected: (v: V) => boolean;
  onSelect: (v: V) => void;
}

// ─── Base props shared by all variants ────────────────────────────────────────

interface SelectBaseProps<TData = unknown, V extends string = string>
  extends SelectTriggerAppearance {
  /** Static array or sync getter */
  options?: SelectOptionsArray<V> | SelectOptionsGetter<V>;
  /** Async fetcher */
  fetchOptions?: SelectOptionsFetcher<TData>;
  /** Maps a raw fetched item to a SelectOption */
  getOption?: (item: TData) => SelectOption<V>;
  /** Enable search input inside the trigger */
  search?: boolean;
  /** true = fetch on mount (eager). false = fetch on first open (lazy, default) */
  fetchOnMount?: boolean;
  /** Load once on first open, keep options on subsequent opens — re-fetch only when query changes */
  loadOnce?: boolean;
  /** Debounce delay in ms for search re-fetches. Default: 300 */
  debounce?: number;
  /** External loading override (e.g. when options are fetched outside the component) */
  loading?: boolean;
  disabled?: boolean;
  empty?: React.ReactNode;
  /** Called when the popover opens or closes (useful for form blur) */
  onOpenChange?: (open: boolean) => void;
  /** Custom list renderer — replaces the default flat option list */
  renderOptions?: (ctx: RenderOptionsContext<V>) => React.ReactNode;
}

// ─── Value / onChange variants ─────────────────────────────────────────────────

/** Single — not clearable */
interface SelectSingleProps<V extends string = string> {
  multi?: false;
  clearable?: false;
  value?: V;
  onChange?: (value: V) => void;
}

/** Single — clearable: onChange receives V | null (null = cleared) */
interface SelectSingleClearableProps<V extends string = string> {
  multi?: false;
  clearable: true;
  value?: V | null;
  onChange?: (value: V | null) => void;
}

/** Multi-select */
interface SelectMultiProps<V extends string = string> {
  multi: true;
  clearable?: boolean;
  value?: V[];
  onChange?: (value: V[]) => void;
  /** true = render tags (default), false = comma-separated text */
  tagsDisplay?: boolean;
}

// ─── Combined SelectProps ──────────────────────────────────────────────────────

export type SelectProps<TData = unknown, V extends string = string> =
  SelectBaseProps<TData, V> &
    (SelectSingleProps<V> | SelectSingleClearableProps<V> | SelectMultiProps<V>);

// ─── GroupedSelectProps ────────────────────────────────────────────────────────

export type GroupedSelectProps<V extends string = string> = Omit<
  SelectProps<unknown, V>,
  "options" | "fetchOptions" | "getOption" | "search" | "fetchOnMount" | "debounce" | "renderOptions"
> & {
  groups?: SelectOptionGroup<V>[];
};

