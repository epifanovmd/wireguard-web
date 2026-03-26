import { useApi } from "@api";
import { IUserOptionDto } from "@api/api-gen/data-contracts";
import { useCallback } from "react";

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
