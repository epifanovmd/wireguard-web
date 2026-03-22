import { useCallback } from "react";

import { useApi } from "~@api";
import { IUserOptionDto } from "~@api/api-gen/data-contracts";

export const useUsersSelectOptions = () => {
  const api = useApi();

  const fetchOptions = useCallback(
    (query?: string) =>
      api
        .getUserOptions({ query })
        .then(res => res.data?.data ?? [])
        .catch(() => [] as IUserOptionDto[]),
    [api],
  );

  const getOption = useCallback(
    (u: IUserOptionDto) => ({ value: u.id, label: u.name }),
    [],
  );

  return { fetchOptions, getOption };
};
