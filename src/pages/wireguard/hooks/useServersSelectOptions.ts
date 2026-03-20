import { useCallback } from "react";

import { useApi } from "~@api";
import { WgServerDto } from "~@api/api-gen/data-contracts";

export const useServersSelectOptions = () => {
  const api = useApi();

  const fetchOptions = useCallback(
    () =>
      api
        .getServers({ limit: 100 })
        .then(res => res.data?.data ?? [])
        .catch(() => [] as WgServerDto[]),
    [api],
  );

  const getOption = useCallback(
    (s: WgServerDto) => ({ value: s.id, label: s.name }),
    [],
  );

  return { fetchOptions, getOption };
};
