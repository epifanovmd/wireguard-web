import { useClientsDataStore } from "@store";
import { useEffect } from "react";

export const useClientsVM = () => {
  const { models, onRefresh, unSubscribeSocket } = useClientsDataStore();

  useEffect(() => {
    onRefresh().then();

    return () => {
      unSubscribeSocket();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { list: models };
};
