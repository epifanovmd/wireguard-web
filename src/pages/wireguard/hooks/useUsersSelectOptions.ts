import { useCallback } from "react";

import { useApi } from "~@api";
import { UserDto } from "~@api/api-gen/data-contracts";

export const useUsersSelectOptions = () => {
  const api = useApi();

  const fetchOptions = useCallback(
    () =>
      api
        .getUsers({ limit: 100 })
        .then(res => res.data?.data ?? [])
        .catch(() => [] as UserDto[]),
    [api],
  );

  const getOption = useCallback((u: UserDto) => {
    const { firstName, lastName } = u.profile ?? {};
    const name =
      firstName || lastName ? [firstName, lastName].filter(Boolean).join(" ") : undefined;

    return { value: u.id, label: name ?? u.email ?? u.id };
  }, []);

  return { fetchOptions, getOption };
};
