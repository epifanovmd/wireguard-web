import { useCallback } from "react";

import { useApi } from "~@api";
import { IWgServerOptionDto } from "~@api/api-gen/data-contracts";

export const useServersSelectOptions = () => {
  const api = useApi();

  const fetchOptions = useCallback(
    (query?: string) =>
      api
        .getServerOptions({ query })
        .then(res => res.data?.data ?? [])
        .catch(() => [] as IWgServerOptionDto[]),
    [api],
  );

  const getOption = useCallback(
    (s: IWgServerOptionDto) => ({ value: s.id, label: s.name }),
    [],
  );

  return { fetchOptions, getOption };
};
