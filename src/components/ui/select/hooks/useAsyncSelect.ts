import * as React from "react";

import { type SelectOption } from "../types";

export interface UseAsyncSelectOptions<TData, TValue extends string = string> {
  /** Function that fetches raw data. Receives an AbortSignal for cancellation. */
  fetchOptions: (signal?: AbortSignal) => Promise<TData[]>;
  /** Maps a raw data item to a SelectOption. */
  getOption: (item: TData) => SelectOption<TValue>;
  /** Fetch immediately on mount instead of waiting for first open. Default: false. */
  fetchOnMount?: boolean;
}

export interface UseAsyncSelectResult<TValue extends string = string> {
  options: SelectOption<TValue>[];
  loading: boolean;
  error: Error | undefined;
  /** Trigger a fresh fetch (resets loaded state). */
  reload: () => void;
  /** Pass to the Select's onOpenChange — fetches on first open. */
  handleOpenChange: (open: boolean) => void;
}

export const useAsyncSelect = <TData, TValue extends string = string>({
  fetchOptions,
  getOption,
  fetchOnMount = false,
}: UseAsyncSelectOptions<TData, TValue>): UseAsyncSelectResult<TValue> => {
  const [options, setOptions] = React.useState<SelectOption<TValue>[]>([]);
  const [loading, setLoading] = React.useState(fetchOnMount);
  const [error, setError] = React.useState<Error | undefined>();
  const loadedRef = React.useRef(false);

  // Stable refs so load() doesn't change identity when props change
  const fetchRef = React.useRef(fetchOptions);
  const getOptionRef = React.useRef(getOption);
  fetchRef.current = fetchOptions;
  getOptionRef.current = getOption;

  const load = React.useCallback(async (signal?: AbortSignal) => {
    setLoading(true);
    setError(undefined);
    try {
      const data = await fetchRef.current(signal);
      if (signal?.aborted) return;
      setOptions(data.map(item => getOptionRef.current(item)));
      loadedRef.current = true;
    } catch (err) {
      if (signal?.aborted) return;
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      if (!signal?.aborted) setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    if (!fetchOnMount) return;
    const controller = new AbortController();
    load(controller.signal);
    return () => controller.abort();
  }, [fetchOnMount, load]);

  const reload = React.useCallback(() => {
    loadedRef.current = false;
    load();
  }, [load]);

  const handleOpenChange = React.useCallback(
    (open: boolean) => {
      if (open && !loadedRef.current && !loading) {
        load();
      }
    },
    [load, loading],
  );

  return { options, loading, error, reload, handleOpenChange };
};
