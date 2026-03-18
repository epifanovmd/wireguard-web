import { useNavigate } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo } from "react";

import { ServerActionsLiveStatus } from "~@components/shared";
import { serverColumns } from "~@components/tables/servers";
import { type ColumnDef, useConfirm, useToast } from "~@components/ui2";
import { ServerModel } from "~@models";
import { useServerDetailStore, useServersListStore } from "~@store";

export const useServersListVM = () => {
  const listStore = useServersListStore();
  const detailStore = useServerDetailStore();
  const navigate = useNavigate();
  const confirm = useConfirm();
  const toast = useToast();

  useEffect(() => {
    listStore.load().then();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAction = useCallback(
    async (id: string, action: "start" | "stop" | "restart" | "delete") => {
      if (action === "delete") {
        const ok = await confirm({
          title: "Delete server",
          message: "This will permanently delete the server and all its peers.",
          variant: "danger",
        });

        if (!ok) return;
      }

      let res;

      if (action === "start") res = await detailStore.startServer(id);
      else if (action === "stop") res = await detailStore.stopServer(id);
      else if (action === "restart") res = await detailStore.restartServer(id);
      else {
        res = await detailStore.deleteServer(id);
        if (!res?.error) listStore.removeServer(id);
      }

      if (res?.error) toast.error(res.error.message);
      else if (action === "delete") toast.success("Server deleted");
      else if (res?.data) listStore.updateServer(res.data);
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

  const columnsReadOnly: ColumnDef<ServerModel>[] = useMemo(
    () => serverColumns,
    [],
  );

  const createServer = useCallback(
    async (params: any) => {
      return listStore.createServer(params);
    },
    [listStore],
  );

  return {
    data: listStore.models,
    columns,
    columnsReadOnly,
    loading: listStore.isLoading,
    total: listStore.total,
    handleRowClick,
    createServer,
  };
};
