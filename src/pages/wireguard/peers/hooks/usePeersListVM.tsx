import { useNavigate } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useState } from "react";

import { EWgServerStatus } from "~@api/api-gen/data-contracts";
import { PeerActions } from "~@components/shared";
import { peerColumns } from "~@components/tables/peers";
import { PeerModel } from "~@models";
import {
  usePeerDataStore,
  usePeersListStore,
  useServersListStore,
} from "~@store";

import {
  type ColumnDef,
  useConfirm,
  useToast,
} from "../../../../components/ui2";

export const usePeersListVM = (_serverId?: string) => {
  const listStore = usePeersListStore();
  const peerStore = usePeerDataStore();
  const serversStore = useServersListStore();
  const navigate = useNavigate();
  const confirm = useConfirm();
  const toast = useToast();

  const [qrPeer, setQrPeer] = useState<{ id: string; name: string } | null>(
    null,
  );
  const [serverId, setServerId] = useState<string | undefined>(_serverId);

  useEffect(() => {
    if (!serverId) {
      serversStore.load().then(() => {
        if (serversStore.models[0]) setServerId(serversStore.models[0].data.id);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (serverId) {
      listStore.loadByServer(serverId).then();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [serverId]);

  const handleToggle = useCallback(
    async (id: string, status: EWgServerStatus) => {
      const res =
        status === EWgServerStatus.Up
          ? await peerStore.stopPeer(id)
          : await peerStore.startPeer(id);

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
            status={row.original.status}
            onToggle={() =>
              handleToggle(row.original.data.id, row.original.status)
            }
            onDelete={() =>
              handleDelete(row.original.data.id, row.original.name)
            }
            onQr={() =>
              setQrPeer({ id: row.original.data.id, name: row.original.name })
            }
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

  const onPageChange = useCallback(
    (page: number) => {
      listStore.goToPage(page);
    },
    [listStore],
  );

  const onPageSizeChange = useCallback(
    (pageSize: number) => {
      listStore.setPageSize(pageSize);
    },
    [listStore],
  );

  const { page, pageSize } = listStore.peersHolder.pagination;

  return {
    serverId,
    setServerId,
    data: listStore.models,
    columns,
    loading: listStore.isLoading,
    refreshing: listStore.peersHolder.isRefreshing,
    total: listStore.total,
    currentPage: page,
    totalPages: listStore.pageCount,
    pageSize,
    onPageChange,
    onPageSizeChange,
    servers: serversStore.models,
    isLoadingServers: serversStore.isLoading,
    qrPeer,
    setQrPeer,
    handleRowClick,
    createPeer,
  };
};
