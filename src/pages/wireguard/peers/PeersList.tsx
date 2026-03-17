import { useNavigate } from "@tanstack/react-router";
import { Power, QrCode, Search, Trash2 } from "lucide-react";
import { observer } from "mobx-react-lite";
import { FC, useEffect, useState } from "react";

import { PageHeader } from "~@components/layouts";
import {
  Badge,
  Button,
  Card,
  type ColumnDef,
  CopyableText,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  ModalTitle,
  Select,
  Table,
  useConfirm,
  useToast,
} from "~@components/ui2";
import { PeerModel } from "~@models";
import { usePeersDataStore, useServersDataStore } from "~@store";

import { useWgPeer } from "../../../socket";
import { PeerForm } from "./components/PeerForm";
import { PeerStatusBadge } from "./components/PeerStatusBadge";
import { QrCodeModal } from "./components/QrCodeModal";

const PeerNameCell: FC<{ peer: PeerModel }> = ({ peer }) => (
  <div>
    <p className="font-medium text-[var(--foreground)]">{peer.name}</p>
    <CopyableText
      text={peer.data.publicKey}
      displayText={peer.shortPublicKey}
      className="mt-0.5 text-[var(--muted-foreground)]"
    />
  </div>
);

const PeerStatusCell: FC<{ peer: PeerModel }> = ({ peer }) => {
  const { status: liveStatus } = useWgPeer(peer.data.id);
  return (
    <div>
      <div className="flex items-center gap-1.5 flex-wrap">
        <PeerStatusBadge enabled={peer.enabled} isExpired={peer.isExpired} />
        {liveStatus?.isActive && (
          <Badge variant="success" dot>Online</Badge>
        )}
      </div>
      {liveStatus?.endpoint && (
        <p className="text-xs text-[var(--muted-foreground)] mt-0.5">
          {liveStatus.endpoint}
        </p>
      )}
    </div>
  );
};

const PeerHandshakeCell: FC<{ peer: PeerModel }> = ({ peer }) => {
  const { status: liveStatus } = useWgPeer(peer.data.id);
  return (
    <span className="text-xs text-[var(--muted-foreground)]">
      {liveStatus?.lastHandshake
        ? new Date(liveStatus.lastHandshake).toLocaleString()
        : peer.createdAtFormatted}
    </span>
  );
};

interface PeerActionsCellProps {
  peer: PeerModel;
  loading: string | undefined;
  onToggle: (id: string, enabled: boolean) => void;
  onDelete: (id: string, name: string) => void;
  onQr: (id: string, name: string) => void;
}

const PeerActionsCell: FC<PeerActionsCellProps> = ({
  peer,
  loading,
  onToggle,
  onDelete,
  onQr,
}) => (
  <div
    className="flex items-center justify-end gap-0.5"
    onClick={e => e.stopPropagation()}
  >
    <button
      title="QR Code"
      className="cursor-pointer p-1.5 rounded-md hover:bg-[var(--accent)] text-[var(--muted-foreground)] hover:text-[#6366f1] transition-colors"
      onClick={() => onQr(peer.data.id, peer.name)}
    >
      <QrCode size={15} />
    </button>
    <button
      title={peer.enabled ? "Disable" : "Enable"}
      className={`cursor-pointer p-1.5 rounded-md transition-colors ${
        peer.enabled
          ? "text-[var(--muted-foreground)] hover:bg-warning/10 hover:text-warning"
          : "text-[var(--muted-foreground)] hover:bg-success/10 hover:text-success"
      }`}
      onClick={() => onToggle(peer.data.id, peer.enabled)}
      disabled={loading === "toggle"}
    >
      <Power size={15} />
    </button>
    <button
      title="Delete"
      className="cursor-pointer p-1.5 rounded-md text-[var(--muted-foreground)] hover:bg-destructive/10 hover:text-destructive transition-colors"
      disabled={loading === "delete"}
      onClick={() => onDelete(peer.data.id, peer.name)}
    >
      <Trash2 size={15} />
    </button>
  </div>
);

export const PeersList: FC = observer(() => {
  const store = usePeersDataStore();
  const serversStore = useServersDataStore();
  const navigate = useNavigate();
  const confirm = useConfirm();
  const toast = useToast();

  const [serverFilter, setServerFilter] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [createOpen, setCreateOpen] = useState(false);
  const [qrPeer, setQrPeer] = useState<{ id: string; name: string } | null>(null);
  const [actionLoading, setActionLoading] = useState<Record<string, string>>({});

  useEffect(() => {
    serversStore.loadServers();
    if (serverFilter) {
      store.loadPeersByServer(serverFilter);
    } else {
      if (serversStore.servers.length > 0) {
        store.loadPeersByServer(serversStore.servers[0].id);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [serverFilter]);

  useEffect(() => {
    if (serversStore.servers.length > 0 && !serverFilter) {
      store.loadPeersByServer(serversStore.servers[0].id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [serversStore.servers.length]);

  const filtered = store.models.filter(p => {
    const matchSearch =
      !search || p.name.toLowerCase().includes(search.toLowerCase());
    const matchStatus =
      !statusFilter ||
      (statusFilter === "enabled" && p.enabled && !p.isExpired) ||
      (statusFilter === "disabled" && !p.enabled) ||
      (statusFilter === "expired" && p.isExpired);
    return matchSearch && matchStatus;
  });

  const setLoading = (id: string, action: string) =>
    setActionLoading(prev => ({ ...prev, [id]: action }));
  const clearLoading = (id: string) =>
    setActionLoading(prev => {
      const n = { ...prev };
      delete n[id];
      return n;
    });

  const handleToggle = async (id: string, enabled: boolean) => {
    setLoading(id, "toggle");
    const res = enabled
      ? await store.disablePeer(id)
      : await store.enablePeer(id);
    clearLoading(id);
    if (res.error) toast.error(res.error.message);
  };

  const handleDelete = async (id: string, name: string) => {
    const ok = await confirm({
      title: "Delete peer",
      message: `Delete peer "${name}"?`,
      variant: "danger",
    });
    if (!ok) return;
    setLoading(id, "delete");
    const res = await store.deletePeer(id);
    clearLoading(id);
    if (res.error) toast.error(res.error.message);
    else toast.success("Peer deleted");
  };

  const columns: ColumnDef<PeerModel>[] = [
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => <PeerNameCell peer={row.original} />,
    },
    {
      accessorKey: "allowedIPs",
      header: "IP",
      cell: ({ row }) => (
        <span className="font-mono text-xs text-[var(--muted-foreground)]">
          {row.original.data.allowedIPs}
        </span>
      ),
    },
    {
      id: "status",
      header: "Status",
      cell: ({ row }) => <PeerStatusCell peer={row.original} />,
    },
    {
      id: "psk",
      header: "PSK",
      cell: ({ row }) =>
        row.original.data.hasPresharedKey ? (
          <Badge variant="info" dot>Yes</Badge>
        ) : (
          <span className="text-xs text-[var(--muted-foreground)]">No</span>
        ),
    },
    {
      accessorKey: "expiresAt",
      header: "Expires",
      cell: ({ row }) => (
        <span className="text-xs text-[var(--muted-foreground)]">
          {row.original.expiresAtFormatted ?? "Never"}
        </span>
      ),
    },
    {
      id: "handshake",
      header: "Last handshake",
      cell: ({ row }) => <PeerHandshakeCell peer={row.original} />,
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => (
        <PeerActionsCell
          peer={row.original}
          loading={actionLoading[row.original.data.id]}
          onToggle={handleToggle}
          onDelete={handleDelete}
          onQr={(id, name) => setQrPeer({ id, name })}
        />
      ),
    },
  ];

  return (
    <div className="flex flex-col h-full">
      <PageHeader
        title="Peers"
        subtitle={`${store.total} total`}
        actions={<Button onClick={() => setCreateOpen(true)}>Add peer</Button>}
      />
      <div className="p-4 sm:p-6 flex flex-col gap-4">
        <div className="flex gap-3 flex-wrap">
          <Input
            placeholder="Search by name..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            wrapperClassName="flex-1 min-w-[180px]"
            leftIcon={<Search size={16} />}
          />
          <Select
            options={[
              { value: "all", label: "All servers" },
              ...serversStore.servers.map(s => ({
                value: s.id,
                label: s.name,
              })),
            ]}
            value={serverFilter || "all"}
            onValueChange={v => setServerFilter(v === "all" ? "" : (v ?? ""))}
            triggerClassName="w-44"
          />
          <Select
            options={[
              { value: "all", label: "All statuses" },
              { value: "enabled", label: "Enabled" },
              { value: "disabled", label: "Disabled" },
              { value: "expired", label: "Expired" },
            ]}
            value={statusFilter || "all"}
            onValueChange={v => setStatusFilter(v === "all" ? "" : (v ?? ""))}
            triggerClassName="w-36"
          />
        </div>

        <Card>
          <Table
            columns={columns}
            data={filtered}
            getRowId={p => p.data.id}
            loading={!store.listHolder.isReady && !store.listHolder.isError}
            empty={
              <div className="text-center py-8 text-[var(--muted-foreground)] text-sm">
                No peers found — add peers or adjust filters
              </div>
            }
            onRowClick={peer =>
              navigate({
                to: "/wireguard/peers/$peerId",
                params: { peerId: peer.data.id },
              })
            }
          />
        </Card>
      </div>

      <Modal open={createOpen} onOpenChange={open => !open && setCreateOpen(false)}>
        <ModalOverlay />
        <ModalContent className="max-w-lg">
          <ModalHeader>
            <ModalTitle>Add peer</ModalTitle>
          </ModalHeader>
          <ModalBody>
            <PeerForm
              servers={serversStore.servers}
              selectedServerId={serverFilter || serversStore.servers[0]?.id}
              onCancel={() => setCreateOpen(false)}
              onSubmit={async (data, serverId) => {
                if (!serverId) {
                  toast.error("Select a server");
                  return;
                }
                const res = await store.createPeer(serverId, data as any);
                if (res.error) toast.error(res.error.message);
                else {
                  toast.success("Peer created");
                  setCreateOpen(false);
                }
              }}
            />
          </ModalBody>
        </ModalContent>
      </Modal>

      {qrPeer && (
        <QrCodeModal
          open
          peerId={qrPeer.id}
          peerName={qrPeer.name}
          onClose={() => setQrPeer(null)}
        />
      )}
    </div>
  );
});
