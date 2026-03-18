import { useNavigate } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useState } from "react";

import { ServerActionCell } from "~@components/shared";
import { serverColumns } from "~@components/tables/servers";
import { ServerModel } from "~@models";
import { useServerDetailStore, useServersListStore } from "~@store";

import {
  type ColumnDef,
  useConfirm,
  useToast,
} from "../../../../components/ui2";
import { useWgServer } from "../../../../socket";

const ServerActionLiveCell = ({
  server,
  loading,
  onAction,
}: {
  server: ServerModel;
  loading: string | undefined;
  onAction: (
    id: string,
    action: "start" | "stop" | "restart" | "delete",
  ) => void;
}) => {
  const { status: liveStatus } = useWgServer(server.data.id);
  const effectiveStatus = liveStatus?.status ?? server.data.status;

  return (
    <ServerActionCell
      server={server}
      effectiveStatus={effectiveStatus}
      loading={loading}
      onAction={onAction}
    />
  );
};

export const useServersListVM = () => {
  const listStore = useServersListStore();
  const detailStore = useServerDetailStore();
  const navigate = useNavigate();
  const confirm = useConfirm();
  const toast = useToast();

  const [actionLoading, setActionLoading] = useState<Record<string, string>>(
    {},
  );

  useEffect(() => {
    listStore.load().then();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setLoading = (id: string, action: string) =>
    setActionLoading(prev => ({ ...prev, [id]: action }));
  const clearLoading = (id: string) =>
    setActionLoading(prev => {
      const n = { ...prev };
      delete n[id];

      return n;
    });

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

      setLoading(id, action);
      let res;

      if (action === "start") res = await detailStore.startServer(id);
      else if (action === "stop") res = await detailStore.stopServer(id);
      else if (action === "restart") res = await detailStore.restartServer(id);
      else {
        res = await detailStore.deleteServer(id);
        if (!res?.error) listStore.removeServer(id);
      }

      clearLoading(id);

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
          <ServerActionLiveCell
            server={row.original}
            loading={actionLoading[row.original.data.id]}
            onAction={handleAction}
          />
        ),
      },
    ],
    [actionLoading, handleAction],
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
