import {
  EPermissions,
  EWgServerStatus,
  IWgServerUpdateRequestDto,
} from "@api/api-gen/data-contracts";
import { useNotification } from "@core/notifications";
import { usePermissions, useServerDetailStore } from "@store";
import { useServerStatsStore } from "@store/serverStats";
import { useCallback, useEffect, useState } from "react";

import { useWgServer } from "../../../../socket";
import { usePeersListVM } from "../../peers/hooks";

export const useServerDetailVM = (serverId: string) => {
  const serverStore = useServerDetailStore();
  const serverStatsStore = useServerStatsStore();
  const toast = useNotification();
  const { hasPermission } = usePermissions();

  const canViewStats = hasPermission(EPermissions.WgStatsView);

  const [editOpen, setEditOpen] = useState(false);

  const { status: liveSocketStatus } = useWgServer(serverId);

  useEffect(() => {
    if (!canViewStats) return;

    return serverStatsStore.subscribe(serverId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [serverId]);

  useEffect(() => {
    serverStore.loadServer(serverId);
    serverStore.startStatusPolling(serverId);

    return () => serverStore.stopStatusPolling();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [serverId]);

  const server = serverStore.server;
  const liveStatus = serverStore.liveStatus;
  const effectiveStatus =
    liveSocketStatus?.status ?? server?.status ?? EWgServerStatus.Unknown;
  const peerCount = liveStatus?.peerCount;
  const activePeerCount = liveStatus?.activePeerCount;

  const handleAction = useCallback(
    async (action: "start" | "stop" | "restart") => {
      let res;

      if (action === "start") res = await serverStore.startServer(serverId);
      else if (action === "stop") res = await serverStore.stopServer(serverId);
      else res = await serverStore.restartServer(serverId);

      if (res?.error) toast.error(res.error.message);
    },
    [serverStore, serverId, toast],
  );

  const handleUpdate = useCallback(
    async (data: IWgServerUpdateRequestDto) => {
      const res = await serverStore.updateServer(serverId, data);

      if (res.error) {
        toast.error(res.error.message);
      } else {
        toast.success("Сервер обновлён");
        setEditOpen(false);
      }
    },
    [serverStore, serverId, toast],
  );

  const peersVM = usePeersListVM(serverId);

  return {
    server,
    serverModel: serverStore.serverModel,
    isLoading: serverStore.pageHolder.isLoading,
    isError: serverStore.serverHolder.isError,
    isActionLoading: serverStore.serverActionMutation.isLoading,
    isUpdateLoading: serverStore.updateServerMutation.isLoading,
    isFilled: serverStore.serverHolder.isFilled,
    effectiveStatus,
    peerCount,
    activePeerCount,
    editOpen,
    setEditOpen,
    handleAction,
    handleUpdate,
    peersVM,
  };
};
