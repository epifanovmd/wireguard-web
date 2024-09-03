import { useEffect } from "react";

import { useClientsDataStore } from "~@store";

export const useClientsVM = () => {
  const {
    models,
    onRefresh,
    createClient,
    deleteClient,
    unSubscribeSocket,
    loading,
  } = useClientsDataStore();

  useEffect(() => {
    onRefresh().then();

    return () => {
      unSubscribeSocket();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { list: models, loading, onRefresh, createClient, deleteClient };
};
