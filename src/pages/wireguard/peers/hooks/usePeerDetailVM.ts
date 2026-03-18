import { useCallback, useEffect, useState } from "react";

import { useConfirm, useToast } from "~@components/ui2";
import { usePeerDataStore } from "~@store";
import { usePeerStatsStore } from "~@store/peerStats";

export const usePeerDetailVM = (peerId: string, onBack: () => void) => {
  const peerStore = usePeerDataStore();
  const peerStatsStore = usePeerStatsStore();
  const confirm = useConfirm();
  const toast = useToast();

  const [editOpen, setEditOpen] = useState(false);
  const [qrOpen, setQrOpen] = useState(false);

  useEffect(() => {
    return peerStatsStore.subscribe(peerId);
    // eslint-disable-next-line
  }, [peerId]);

  useEffect(() => {
    peerStore.loadPeer(peerId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [peerId]);

  const handleToggle = useCallback(async () => {
    if (!peerStore.peer) return;
    const res = peerStore.peer.enabled
      ? await peerStore.disablePeer(peerId)
      : await peerStore.enablePeer(peerId);

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
    async (data: any) => {
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

  return {
    peer: peerStore.peer,
    model: peerStore.peerModel,
    isLoading: peerStore.peerHolder.isLoading,
    isReady: peerStore.peerHolder.isReady,
    liveStats: peerStatsStore.stats,
    liveStatus: peerStatsStore.status,
    speedPoints: peerStatsStore.speedPoints,
    trafficPoints: peerStatsStore.trafficPoints,
    editOpen,
    setEditOpen,
    qrOpen,
    setQrOpen,
    handleToggle,
    handleDelete,
    handleUpdate,
    handleRotatePsk,
    handleRemovePsk,
  };
};
