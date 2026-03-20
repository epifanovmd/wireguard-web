import * as React from "react";

import { type SelectOption } from "../types";

export interface UseAsyncSelectOptions<TData, TValue extends string = string> {
  /** Function that fetches raw data. Receives a search query and AbortSignal. */
  fetchOptions: (query: string, signal?: AbortSignal) => Promise<TData[]>;
  /** Maps a raw data item to a SelectOption. */
  getOption: (item: TData) => SelectOption<TValue>;
  /** Fetch immediately on mount instead of waiting for first open. Default: false. */
  fetchOnMount?: boolean;
  /** Enable search/query mode. Default: false. */
  search?: boolean;
  /** Debounce delay in ms for search re-fetches. Default: 300. */
  searchDebounce?: number;
}

export interface UseAsyncSelectResult<TValue extends string = string> {
  options: SelectOption<TValue>[];
  loading: boolean;
  error: Error | undefined;
  /** Trigger a fresh fetch (resets loaded state). */
  reload: () => void;
  /** Pass to the Select's onOpenChange — fetches on first open (non-search) or every open (search). */
  handleOpenChange: (open: boolean) => void;
  query: string;
  setQuery: (q: string) => void;
}

export const useAsyncSelect = <TData, TValue extends string = string>({
  fetchOptions,
  getOption,
  fetchOnMount = false,
  search = false,
  searchDebounce = 300,
}: UseAsyncSelectOptions<TData, TValue>): UseAsyncSelectResult<TValue> => {
  const [options, setOptions] = React.useState<SelectOption<TValue>[]>([]);
  const [loading, setLoading] = React.useState(fetchOnMount);
  const [error, setError] = React.useState<Error | undefined>();
  const [query, setQuery] = React.useState("");
  const [isOpen, setIsOpen] = React.useState(false);
  const loadedRef = React.useRef(false);

  // Stable refs — updated every render so load() stays stable with [] deps
  const fetchRef = React.useRef(fetchOptions);
  const getOptionRef = React.useRef(getOption);
  const searchRef = React.useRef(search);
  fetchRef.current = fetchOptions;
  getOptionRef.current = getOption;
  searchRef.current = search;

  const load = React.useCallback(async (q: string, signal?: AbortSignal) => {
    setLoading(true);
    setError(undefined);
    try {
      const data = await fetchRef.current(q, signal);

      if (signal?.aborted) return;
      setOptions(data.map(item => getOptionRef.current(item)));
      if (!searchRef.current) loadedRef.current = true;
    } catch (err) {
      if (signal?.aborted) return;
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      if (!signal?.aborted) setLoading(false);
    }
  }, []);

  // Non-search: fetch on mount once
  React.useEffect(() => {
    if (search || !fetchOnMount) return;
    const controller = new AbortController();

    load("", controller.signal);

    return () => controller.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Search: fetch on mount (empty query, no debounce)
  React.useEffect(() => {
    if (!search || !fetchOnMount) return;
    const controller = new AbortController();

    load("", controller.signal);

    return () => controller.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Search: debounced re-fetch when query or isOpen changes
  React.useEffect(() => {
    if (!search || !isOpen) return;
    const controller = new AbortController();
    // No debounce for empty query (initial open), debounce for typed queries
    const delay = query ? searchDebounce : 0;
    const timer = setTimeout(() => {
      load(query, controller.signal);
    }, delay);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, query, isOpen, searchDebounce]);

  const reload = React.useCallback(() => {
    loadedRef.current = false;
    load(query);
  }, [load, query]);

  const handleOpenChange = React.useCallback(
    (open: boolean) => {
      if (search) {
        setIsOpen(open);

        return;
      }
      if (open && !loadedRef.current && !loading) {
        load("");
      }
    },
    [search, load, loading],
  );

  return { options, loading, error, reload, handleOpenChange, query, setQuery };
};
