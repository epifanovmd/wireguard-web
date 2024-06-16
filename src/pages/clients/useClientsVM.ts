import { useClientsDataStore } from "../../store";

export const useClientsVM = () => {
  const { models, onRefresh } = useClientsDataStore();

  return { list: models, refresh: onRefresh };
};
