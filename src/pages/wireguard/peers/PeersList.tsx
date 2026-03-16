import { useNavigate } from "@tanstack/react-router";
import { Power, QrCode, Search, Trash2 } from "lucide-react";
import { observer } from "mobx-react-lite";
import React, { FC, useEffect, useState } from "react";

import {
  Badge,
  Button,
  Card,
  CopyableText,
  Empty,
  Input,
  Modal,
  PageHeader,
  Select,
  Spinner,
  useConfirm,
  useToast,
} from "~@components";
import { PeerModel } from "~@models";
import { usePeersDataStore, useServersDataStore } from "~@store";

import { useWgPeer } from "../../../socket";
import { PeerForm } from "./components/PeerForm";
import { PeerStatusBadge } from "./components/PeerStatusBadge";
import { QrCodeModal } from "./components/QrCodeModal";

// ─── PeerRow — subscribes to live socket status per peer ──────────────────────

interface PeerRowProps {
  peer: PeerModel;
  loading: string | undefined;
  onToggle: (id: string, enabled: boolean) => void;
  onDelete: (id: string, name: string) => void;
  onView: (id: string) => void;
  onQr: (id: string, name: string) => void;
}

const PeerRow: FC<PeerRowProps> = ({
  peer,
  loading,
  onToggle,
  onDelete,
  onView,
  onQr,
}) => {
  const { status: liveStatus } = useWgPeer(peer.data.id);

  return (
    <tr
      className="border-b border-[var(--border-color)] hover:bg-[var(--table-row-hover)] transition-colors cursor-pointer"
      onClick={() => onView(peer.data.id)}
    >
      <td className="px-4 py-3">
        <p className="font-medium text-[var(--text-primary)]">{peer.name}</p>
        <CopyableText
          text={peer.data.publicKey}
          displayText={peer.shortPublicKey}
          className="mt-0.5 text-[var(--text-muted)]"
        />
      </td>
      <td className="px-4 py-3 font-mono text-xs text-[var(--text-secondary)]">
        {peer.data.allowedIPs}
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-1.5 flex-wrap">
          <PeerStatusBadge enabled={peer.enabled} isExpired={peer.isExpired} />
          {liveStatus?.isActive && (
            <Badge variant="success" dot>
              Online
            </Badge>
          )}
        </div>
        {liveStatus?.endpoint && (
          <p className="text-xs text-[var(--text-muted)] mt-0.5">
            {liveStatus.endpoint}
          </p>
        )}
      </td>
      <td className="px-4 py-3">
        {peer.data.hasPresharedKey ? (
          <Badge variant="info" dot>
            Yes
          </Badge>
        ) : (
          <span className="text-xs text-[var(--text-muted)]">No</span>
        )}
      </td>
      <td className="px-4 py-3 text-xs text-[var(--text-muted)]">
        {peer.expiresAtFormatted ?? (
          <span className="text-[var(--text-muted)]">Never</span>
        )}
      </td>
      <td className="px-4 py-3 text-xs text-[var(--text-muted)]">
        {liveStatus?.lastHandshake
          ? new Date(liveStatus.lastHandshake).toLocaleString()
          : peer.createdAtFormatted}
      </td>
      <td className="px-4 py-3" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-end gap-0.5">
          <button
            title="QR Code"
            className="p-1.5 rounded-md hover:bg-[var(--bg-hover,rgba(99,102,241,0.1))] text-[var(--text-muted)] hover:text-[#6366f1] transition-colors"
            onClick={() => onQr(peer.data.id, peer.name)}
          >
            <QrCode size={15} />
          </button>
          <button
            title={peer.enabled ? "Disable" : "Enable"}
            className={`p-1.5 rounded-md transition-colors ${peer.enabled ? "text-[var(--text-muted)] hover:bg-[rgba(234,179,8,0.1)] hover:text-[#ca8a04]" : "text-[var(--text-muted)] hover:bg-[rgba(34,197,94,0.1)] hover:text-[#16a34a]"}`}
            onClick={() => onToggle(peer.data.id, peer.enabled)}
            disabled={loading === "toggle"}
          >
            <Power size={15} />
          </button>
          <button
            title="Delete"
            className="p-1.5 rounded-md text-[var(--text-muted)] hover:bg-[rgba(239,68,68,0.1)] hover:text-[#ef4444] transition-colors"
            disabled={loading === "delete"}
            onClick={() => onDelete(peer.data.id, peer.name)}
          >
            <Trash2 size={15} />
          </button>
        </div>
      </td>
    </tr>
  );
};

// ─── PeersList ────────────────────────────────────────────────────────────────

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
  const [qrPeer, setQrPeer] = useState<{ id: string; name: string } | null>(
    null,
  );
  const [actionLoading, setActionLoading] = useState<Record<string, string>>(
    {},
  );

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

  return (
    <div className="flex flex-col h-full">
      <PageHeader
        title="Peers"
        subtitle={`${store.total} total`}
        actions={<Button onClick={() => setCreateOpen(true)}>Add peer</Button>}
      />
      <div className="p-6 flex flex-col gap-4">
        <div className="flex gap-3 flex-wrap">
          <Input
            placeholder="Search by name..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            wrapperClassName="flex-1 min-w-[180px]"
            leftIcon={<Search size={16} />}
          />
          <Select
            value={serverFilter}
            onChange={v => setServerFilter(v ?? "")}
            data={[
              { value: "", label: "All servers" },
              ...serversStore.servers.map(s => ({
                value: s.id,
                label: s.name,
              })),
            ]}
            className="w-44"
          />
          <Select
            value={statusFilter}
            onChange={v => setStatusFilter(v ?? "")}
            data={[
              { value: "", label: "All statuses" },
              { value: "enabled", label: "Enabled" },
              { value: "disabled", label: "Disabled" },
              { value: "expired", label: "Expired" },
            ]}
            className="w-36"
          />
        </div>

        <Card padding="none">
          {store.isLoading ? (
            <div className="flex justify-center py-12">
              <Spinner />
            </div>
          ) : filtered.length === 0 ? (
            <Empty
              title="No peers found"
              description="Add peers or adjust filters"
              action={{ label: "Add peer", onClick: () => setCreateOpen(true) }}
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[var(--table-header-bg)] border-b border-[var(--border-color)]">
                    <th className="text-left px-4 py-3 text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">
                      Name
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">
                      IP
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">
                      Status
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">
                      PSK
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">
                      Expires
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">
                      Last handshake
                    </th>
                    <th className="text-right px-4 py-3 text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(peer => (
                    <PeerRow
                      key={peer.data.id}
                      peer={peer}
                      loading={actionLoading[peer.data.id]}
                      onToggle={handleToggle}
                      onDelete={handleDelete}
                      onView={id =>
                        navigate({
                          to: "/wireguard/peers/$peerId",
                          params: { peerId: id },
                        })
                      }
                      onQr={(id, name) => setQrPeer({ id, name })}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>

      <Modal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        title="Add peer"
        size="lg"
      >
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
