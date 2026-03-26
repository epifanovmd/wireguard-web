import {
  IWgServerCreateRequestDto,
  IWgServerUpdateRequestDto,
} from "@api/api-gen/data-contracts";
import { ServerActionsLiveStatus } from "@components/shared";
import { serverColumns } from "@components/tables/servers";
import { type ColumnDef, useConfirm } from "@components/ui";
import { useNotification } from "@core/notifications";
import { ServerModel } from "@models";
import { useServerDetailStore, useServersListStore } from "@store";
import { useNavigate } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo } from "react";

export const useServersListVM = () => {
  const listStore = useServersListStore();
  const detailStore = useServerDetailStore();
  const navigate = useNavigate();
  const confirm = useConfirm();
  const toast = useNotification();

  useEffect(() => {
    listStore.load().then();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAction = useCallback(
    async (id: string, action: "start" | "stop" | "restart" | "delete") => {
      if (action === "delete") {
        const ok = await confirm({
          title: "Удалить сервер",
          message: "Сервер и все его пиры будут удалены безвозвратно.",
          variant: "danger",
        });

        if (!ok) return;

        const r = await listStore.deleteServer(id);

        if (r.error) toast.error(r.error.message);

        return;
      }

      let res;

      if (action === "start") res = await detailStore.startServer(id);
      else if (action === "stop") res = await detailStore.stopServer(id);
      else res = await detailStore.restartServer(id);

      if (res.error) {
        toast.error(res.error.message);
      } else {
        if (res.data) listStore.updateServer(res.data);
        const successMessages = {
          start: "Сервер успешно запущен",
          stop: "Сервер успешно остановлен",
          restart: "Сервер успешно перезапущен",
        };

        toast.success(successMessages[action]);
      }
    },
    [detailStore, listStore, confirm, toast],
  );

  const handleRowClick = useCallback(
    (server: ServerModel) => {
      navigate({
        to: "/wireguard/servers/$serverId",
        params: { serverId: server.data.id },
      });
    },
    [navigate],
  );

  const columns: ColumnDef<ServerModel>[] = useMemo(
    () => [
      ...serverColumns,
      {
        id: "actions",
        header: "",
        cell: ({ row }) => (
          <ServerActionsLiveStatus
            server={row.original}
            onAction={handleAction}
          />
        ),
      },
    ],
    [handleAction],
  );

  const createServer = useCallback(
    async (params: IWgServerCreateRequestDto | IWgServerUpdateRequestDto) => {
      return listStore.createServer(params as IWgServerCreateRequestDto);
    },
    [listStore],
  );

  return {
    data: listStore.models,
    columns,
    loading: listStore.isLoading,
    createServerLoading: listStore.createServerMutation.isLoading,
    total: listStore.total,
    handleRowClick,
    createServer,
  };
};
