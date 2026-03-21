import * as React from "react";

import { SelectOption } from "../types";

export function useLabelCache<V extends string>() {
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
