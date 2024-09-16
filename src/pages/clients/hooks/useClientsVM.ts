import { useCallback, useEffect, useState } from "react";

import { ICreateServerRequest } from "~@service";
import { useClientsDataStore, useServerDataStore } from "~@store";

export const useClientsVM = () => {
  const [serverId, setServerId] = useState<string>();

  const {
    models: clients,
    loading: clientsLoading,
    onRefresh: onRefreshClients,
    updateClient,
    createClient,
    deleteClient,
    unSubscribeSocket,
  } = useClientsDataStore();

  const {
    models: servers,
    loading: serversLoading,
    onRefresh: onRefreshServers,
    createServer,
    deleteServer,
  } = useServerDataStore();

  useEffect(() => {
    onRefreshServers().then(res => {
      const id = res?.[0]?.id;

      if (id && !serverId) {
        setServerId(id);
      }
    });

    return () => {
      unSubscribeSocket();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (serverId) {
      onRefreshClients(serverId).then();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [serverId]);

  useEffect(() => {
    if (
      servers.length > 0 &&
      (!serverId || servers.every(server => server.data.id !== serverId))
    ) {
      setServerId(servers[0].data.id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [servers]);

  const onChangeServer = useCallback((serverId: string) => {
    setServerId(serverId);
  }, []);

  const onCreateServer = useCallback(
    async (req: ICreateServerRequest) => {
      const server = await createServer(req);

      if (server) {
        setServerId(server.id);
      }
    },
    [createServer],
  );

  return {
    serverId,
    onChangeServer,
    servers,
    serversLoading,
    createServer: onCreateServer,
    clients,
    clientsLoading,
    updateClient,
    createClient,
    deleteClient,
    deleteServer,
  };
};
