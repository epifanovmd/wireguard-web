import { useCallback, useEffect, useState } from "react";

import { useToast } from "~@components/ui2";
import { useServerDetailStore } from "~@store";
import { useServerStatsStore } from "~@store/serverStats";

import { useWgServer } from "../../../../socket";
import { usePeersListVM } from "../../peers/hooks";

export const useServerDetailVM = (serverId: string, _onBack: () => void) => {
  const serverStore = useServerDetailStore();
  const serverStatsStore = useServerStatsStore();
  const toast = useToast();

  const [editOpen, setEditOpen] = useState(false);

  const { status: liveSocketStatus } = useWgServer(serverId);

  useEffect(() => {
    serverStatsStore.loadServerStats(serverId).then(() => {
      serverStatsStore.subscribe(serverId);
    });

    return serverStatsStore.unsubscribe(serverId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [serverId]);

  useEffect(() => {
    serverStore.loadServer(serverId);
    serverStore.loadServerStatus(serverId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [serverId]);

  const server = serverStore.server;
  const liveStatus = serverStore.liveStatus;
  const effectiveStatus =
    liveSocketStatus?.status ?? server?.status ?? "unknown";
  const peerCount = liveSocketStatus?.peerCount ?? liveStatus?.peerCount;
  const activePeerCount =
    liveSocketStatus?.activePeerCount ?? liveStatus?.activePeerCount;

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
    async (data: any) => {
      const res = await serverStore.updateServer(serverId, data);

      if (res.error) {
        toast.error(res.error.message);
      } else {
        toast.success("Server updated");
        setEditOpen(false);
      }
    },
    [serverStore, serverId, toast],
  );

  const peersVM = usePeersListVM(serverId);

  return {
    server,
    serverModel: serverStore.serverModel,
    isLoading: serverStore.serverHolder.isLoading,
    isReady: serverStore.serverHolder.isReady,
    liveStats: serverStatsStore.stats,
    speedPoints: serverStatsStore.speedPoints,
    trafficPoints: serverStatsStore.trafficPoints,
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
