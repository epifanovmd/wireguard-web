import { useCallback } from "react";

import { useApi } from "~@api";
import { WgPeerDto } from "~@api/api-gen/data-contracts";

export const usePeersSelectOptions = (serverId?: string) => {
  const api = useApi();

  const fetchOptions = useCallback(
    () =>
      serverId
        ? api
            .getPeersByServer({ serverId, limit: 100 })
            .then(res => res.data?.data ?? [])
            .catch(() => [] as WgPeerDto[])
        : Promise.resolve([] as WgPeerDto[]),
    [api, serverId],
  );

  const getOption = useCallback(
    (p: WgPeerDto) => ({ value: p.id, label: p.name }),
    [],
  );

  return { fetchOptions, getOption };
};
