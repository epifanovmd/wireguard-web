import * as React from "react";

import { SelectOption } from "../types";

export interface UseSelectOptionsProps<TData, V extends string> {
  options?: SelectOption<V>[] | ((query: string) => SelectOption<V>[]);
  fetchOptions?: (query: string, signal?: AbortSignal) => Promise<TData[]>;
  getOption?: (item: TData) => SelectOption<V>;
  fetchOnMount?: boolean;
  /** Load once on first open, then keep options — re-fetch only when query changes */
  loadOnce?: boolean;
  debounce?: number;
  search?: boolean;
  query: string;
  open: boolean;
}

export interface UseSelectOptionsResult<V extends string> {
  options: SelectOption<V>[];
  loading: boolean;
}

export function useSelectOptions<TData = unknown, V extends string = string>({
  options: optionsProp,
  fetchOptions,
  getOption,
  fetchOnMount = false,
  loadOnce = false,
  debounce = 300,
  search = false,
  query,
  open,
}: UseSelectOptionsProps<TData, V>): UseSelectOptionsResult<V> {
  const [asyncOptions, setAsyncOptions] = React.useState<SelectOption<V>[]>(
    [],
  );
  const [loading, setLoading] = React.useState(false);

  const lastFetchedQueryRef = React.useRef<string | null>(null);
  // Tracks whether lazy (first-open) fetch has been initiated
  const lazyFetchedRef = React.useRef(false);
  // Tracks whether at least one successful fetch completed (for loadOnce mode)
  const hasLoadedRef = React.useRef(false);

  // Stable refs to avoid stale closures
  const fetchRef = React.useRef(fetchOptions);
  const getOptionRef = React.useRef(getOption);
  fetchRef.current = fetchOptions;
  getOptionRef.current = getOption;

  const isAsync = !!fetchOptions;
  const isStaticArray = Array.isArray(optionsProp);
  const isGetterFn = typeof optionsProp === "function";

  const doFetch = React.useCallback(
    async (q: string, signal: AbortSignal) => {
      if (!fetchRef.current || !getOptionRef.current) return;
      setLoading(true);
      try {
        const data = await fetchRef.current(q, signal);
        if (!signal.aborted) {
          setAsyncOptions(data.map(item => getOptionRef.current!(item)));
          hasLoadedRef.current = true;
        }
      } catch {
        if (!signal.aborted) setAsyncOptions([]);
      } finally {
        if (!signal.aborted) setLoading(false);
      }
    },
    [],
  );

  // ─── Eager load: fetch once on mount (fetchOnMount=true) ────────────────────
  // Empty deps so React StrictMode's double-invocation triggers a real re-fetch
  // on the second run rather than being blocked by a hasFetched ref.
  React.useEffect(() => {
    if (!isAsync || !fetchOnMount) return;
    const ctrl = new AbortController();
    const q = search ? query : "";
    lastFetchedQueryRef.current = q;
    doFetch(q, ctrl.signal);
    return () => ctrl.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // intentionally mount-only

  // ─── Lazy load: fetch on first open, reload on every open (default) ─────────
  React.useEffect(() => {
    if (!isAsync || fetchOnMount || loadOnce || !open || lazyFetchedRef.current) return;
    lazyFetchedRef.current = true;
    const ctrl = new AbortController();
    const q = search ? query : "";
    lastFetchedQueryRef.current = q;
    doFetch(q, ctrl.signal);
    return () => {
      // Reset so StrictMode's cleanup+re-run gets a fresh fetch
      lazyFetchedRef.current = false;
      ctrl.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, isAsync, fetchOnMount, loadOnce]);

  // ─── Load-once: fetch on first open, keep options on subsequent opens ────────
  // Uses hasLoadedRef (set only after a successful fetch) so StrictMode's
  // cleanup+abort correctly allows the second run to re-fetch.
  React.useEffect(() => {
    if (!isAsync || fetchOnMount || !loadOnce || !open || hasLoadedRef.current) return;
    const ctrl = new AbortController();
    const q = search ? query : "";
    lastFetchedQueryRef.current = q;
    doFetch(q, ctrl.signal);
    return () => ctrl.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, isAsync, fetchOnMount, loadOnce]);

  // ─── Re-fetch when query changes (search + async only) ──────────────────────
  React.useEffect(() => {
    if (!isAsync || !search || !open) return;
    if (lastFetchedQueryRef.current === query) return;

    const ctrl = new AbortController();
    const timer = setTimeout(() => {
      lastFetchedQueryRef.current = query;
      doFetch(query, ctrl.signal);
    }, debounce);

    return () => {
      clearTimeout(timer);
      ctrl.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, isAsync, search, open, debounce]);

  // ─── Computed options for static / getter cases ──────────────────────────────
  const computedOptions = React.useMemo<SelectOption<V>[]>(() => {
    if (isStaticArray) {
      const arr = optionsProp as SelectOption<V>[];
      if (!search || !query) return arr;
      const q = query.toLowerCase();
      return arr.filter(o => String(o.label).toLowerCase().includes(q));
    }
    if (isGetterFn) {
      return (optionsProp as (q: string) => SelectOption<V>[])(query);
    }
    return [];
  }, [optionsProp, isStaticArray, isGetterFn, search, query]);

  return {
    options: isAsync ? asyncOptions : computedOptions,
    loading: isAsync ? loading : false,
  };
}
