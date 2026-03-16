import { ComboboxData } from "@mantine/core";
import React, { useCallback, useEffect, useRef, useState } from "react";

import { ISelectProps, Select } from "./Select";

export interface IAsyncSelectProps extends Omit<ISelectProps, "data"> {
  data?: ComboboxData;
  fetchFn?: (query?: string) => Promise<ComboboxData>;
  debounceTimeout?: number;
  fetchOnOpen?: boolean;
}

export const AsyncSelect = ({
  data: initialOptions,
  fetchFn,
  debounceTimeout = 300,
  fetchOnOpen = true,
  ...rest
}: IAsyncSelectProps) => {
  const [options, setOptions] = useState<ComboboxData>(initialOptions ?? []);
  const [loading, setLoading] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const load = useCallback(
    async (query?: string) => {
      if (!fetchFn) return;
      setLoading(true);
      try {
        const data = await fetchFn(query);
        setOptions(data);
      } finally {
        setLoading(false);
      }
    },
    [fetchFn],
  );

  useEffect(() => {
    if (fetchOnOpen && fetchFn) {
      load();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearch = useCallback(
    (query: string) => {
      if (!fetchFn) return;
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => load(query), debounceTimeout);
    },
    [fetchFn, load, debounceTimeout],
  );

  return (
    <Select
      {...rest}
      data={options}
      searchable={!!fetchFn}
      disabled={loading || rest.disabled}
      placeholder={loading ? "Loading..." : rest.placeholder}
      onSearchChange={fetchFn ? handleSearch : undefined}
    />
  );
};
