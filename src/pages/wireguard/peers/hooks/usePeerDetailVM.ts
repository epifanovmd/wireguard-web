import {
  EPermissions,
  EWgServerStatus,
  IWgPeerUpdateRequestDto,
} from "@api/api-gen/data-contracts";
import { useConfirm } from "@components/ui";
import { useNotification } from "@core/notifications";
import { usePeerDataStore, usePermissions } from "@store";
import { usePeerStatsStore } from "@store/peerStats";
import { useCallback, useEffect, useState } from "react";

export const usePeerDetailVM = (peerId: string, onBack: () => void) => {
  const peerStore = usePeerDataStore();
  const peerStatsStore = usePeerStatsStore();
  const confirm = useConfirm();
  const toast = useNotification();
  const { hasPermission } = usePermissions();

  const [editOpen, setEditOpen] = useState(false);
  const [qrOpen, setQrOpen] = useState(false);
  const [assignOpen, setAssignOpen] = useState(false);
  const [assignLoading, setAssignLoading] = useState(false);

  const canViewStats =
    hasPermission(EPermissions.WgStatsView) ||
    hasPermission(EPermissions.WgPeerOwn);

  useEffect(() => {
    if (!canViewStats) return;

    return peerStatsStore.subscribe(peerId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [peerId, canViewStats]);

  useEffect(() => {
    peerStore.loadPeer(peerId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [peerId]);

  const handleToggle = useCallback(async () => {
    if (!peerStore.peer) return;
    const isRunning = peerStore.peer.status === EWgServerStatus.Up;
    const res = isRunning
      ? await peerStore.stopPeer(peerId)
      : await peerStore.startPeer(peerId);

    if (res.error) toast.error(res.error.message);
  }, [peerStore, peerId, toast]);

  const handleDelete = useCallback(async () => {
    const ok = await confirm({
      title: "Удалить пир",
      message: "Удалить этот пир навсегда?",
      variant: "danger",
    });

    if (!ok) return;
    const res = await peerStore.deletePeer(peerId);

    if (res.error) {
      toast.error(res.error.message);
    } else {
      toast.success("Пир удалён");
      onBack();
    }
  }, [peerStore, peerId, confirm, toast, onBack]);

  const handleUpdate = useCallback(
    async (data: IWgPeerUpdateRequestDto) => {
      const res = await peerStore.updatePeer(peerId, data);

      if (res.error) {
        toast.error(res.error.message);
      } else {
        toast.success("Пир обновлён");
        setEditOpen(false);
      }
    },
    [peerStore, peerId, toast],
  );

  const handleRotatePsk = useCallback(async () => {
    const res = await peerStore.rotatePsk(peerId);

    if (res.error) toast.error(res.error.message);
    else toast.success("PSK обновлён");
  }, [peerStore, peerId, toast]);

  const handleRemovePsk = useCallback(async () => {
    const res = await peerStore.removePsk(peerId);

    if (res.error) toast.error(res.error.message);
    else toast.success("PSK удалён");
  }, [peerStore, peerId, toast]);

  const handleAssign = useCallback(
    async (userId: string) => {
      setAssignLoading(true);
      const res = await peerStore.assignPeer(peerId, userId);

      setAssignLoading(false);
      if (res.error) {
        toast.error(res.error.message);
      } else {
        toast.success("Пир назначен пользователю");
        setAssignOpen(false);
      }
    },
    [peerStore, peerId, toast],
  );

  const handleRevoke = useCallback(async () => {
    const res = await peerStore.revokePeer(peerId);

    if (res.error) toast.error(res.error.message);
    else toast.success("Назначение отозвано");
  }, [peerStore, peerId, toast]);

  return {
    peer: peerStore.peer,
    model: peerStore.peerModel,
    isLoading: peerStore.peerHolder.isLoading,
    isError: peerStore.peerHolder.isError,
    isReady: peerStore.peerHolder.isFilled,
    isUpdateLoading: peerStore.updatePeerMutation.isLoading,
    editOpen,
    setEditOpen,
    qrOpen,
    setQrOpen,
    assignOpen,
    setAssignOpen,
    assignLoading,
    handleToggle,
    handleDelete,
    handleUpdate,
    handleRotatePsk,
    handleRemovePsk,
    handleAssign,
    handleRevoke,
  };
};
