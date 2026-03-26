import { useApi } from "@api";
import { IWgPeerOptionDto, WgPeerDto } from "@api/api-gen/data-contracts";
import { useCallback } from "react";

export const usePeersSelectOptions = (serverId?: string) => {
  const api = useApi();

  const fetchOptions = useCallback(
    (query?: string) =>
      serverId
        ? api
            .getPeersOptions({ serverId, query })
            .then(res => res.data?.data ?? [])
            .catch(() => [] as IWgPeerOptionDto[])
        : Promise.resolve([] as WgPeerDto[]),
    [api, serverId],
  );

  const getOption = useCallback(
    (p: IWgPeerOptionDto) => ({ value: p.id, label: p.name }),
    [],
  );

  return { fetchOptions, getOption };
};
