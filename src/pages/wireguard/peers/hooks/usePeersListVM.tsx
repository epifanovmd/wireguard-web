import { useNavigate } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useState } from "react";

import { PeerActions, QrCodeModal } from "~@components/shared";
import { peerColumns } from "~@components/tables/peers";
import { PeerModel } from "~@models";
import { usePeerDataStore, usePeersListStore } from "~@store";
import { useServersListStore } from "~@store";

import {
  type ColumnDef,
  useConfirm,
  useToast,
} from "../../../../components/ui2";

export const usePeersListVM = (serverId?: string) => {
  const listStore = usePeersListStore();
  const peerStore = usePeerDataStore();
  const serversStore = useServersListStore();
  const navigate = useNavigate();
  const confirm = useConfirm();
  const toast = useToast();

  const [qrPeer, setQrPeer] = useState<{ id: string; name: string } | null>(
    null,
  );

  useEffect(() => {
    if (!serverId) {
      serversStore.load();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (serverId) {
      listStore.loadByServer(serverId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [serverId]);

  useEffect(() => {
    if (!serverId && serversStore.listHolder.d.length > 0) {
      listStore.loadByServer(serversStore.listHolder.d[0].id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [serversStore.listHolder.d.length]);

  const handleToggle = useCallback(
    async (id: string, enabled: boolean) => {
      const res = enabled
        ? await peerStore.disablePeer(id)
        : await peerStore.enablePeer(id);

      if (res.error) {
        toast.error(res.error.message);
      } else if (res.data) {
        listStore.updatePeer(res.data);
      }
    },

    [peerStore, listStore, toast],
  );

  const handleDelete = useCallback(
    async (id: string, name: string) => {
      const ok = await confirm({
        title: "Удалить пир",
        message: `Удалить пир «${name}»?`,
        variant: "danger",
      });

      if (!ok) return;
      const res = await peerStore.deletePeer(id);

      if (res.error) {
        toast.error(res.error.message);
      } else {
        toast.success("Пир удалён");
        listStore.removePeer(id);
      }
    },

    [peerStore, listStore, confirm, toast],
  );

  const handleRowClick = useCallback(
    (peer: PeerModel) => {
      navigate({
        to: "/wireguard/peers/$peerId",
        params: { peerId: peer.data.id },
      });
    },
    [navigate],
  );

  const columns: ColumnDef<PeerModel>[] = useMemo(
    () => [
      ...peerColumns,
      {
        id: "actions",
        header: "",
        cell: ({ row }) => (
          <PeerActions
            enabled={row.original.enabled}
            onToggle={() => handleToggle(row.original.data.id, row.original.enabled)}
            onDelete={() => handleDelete(row.original.data.id, row.original.name)}
            onQr={() => setQrPeer({ id: row.original.data.id, name: row.original.name })}
          />
        ),
      },
    ],
    [handleToggle, handleDelete],
  );

  const createPeer = useCallback(
    async (targetServerId: string, params: any) => {
      return listStore.createPeer(targetServerId, params);
    },
    [listStore],
  );

  return {
    data: listStore.models,
    columns,
    loading: listStore.isLoading,
    total: listStore.total,
    servers: serversStore.models,
    qrPeer,
    setQrPeer,
    handleRowClick,
    createPeer,
  };
};
