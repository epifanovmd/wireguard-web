import { useNavigate } from "@tanstack/react-router";
import { Pencil, Play, RotateCcw, Square } from "lucide-react";
import { observer } from "mobx-react-lite";
import { FC, useEffect, useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import {
  Badge,
  Card,
  CopyableText,
  Modal,
  PageHeader,
  Spinner,
  StatCard,
  Table,
  TableColumn,
  Tabs,
  useToast,
} from "~@components";
import { PeerModel } from "~@models";
import {
  usePeersDataStore,
  useServersDataStore,
  useStatsDataStore,
} from "~@store";

import { useWgServer } from "../../../socket";
import { formatBytes, formatSpeed } from "../../dashboard";
import { PeerStatusBadge } from "../peers/components/PeerStatusBadge";
import { ServerForm } from "./components/ServerForm";
import { ServerStatusBadge } from "./components/ServerStatusBadge";

interface ServerDetailProps {
  serverId: string;
  onBack: () => void;
}

export const ServerDetail: FC<ServerDetailProps> = observer(({ serverId }) => {
  const store = useServersDataStore();
  const stats = useStatsDataStore();
  const peersStore = usePeersDataStore();
  const navigate = useNavigate();
  const toast = useToast();
  const [editOpen, setEditOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState("");
  const { stats: liveStats, status: liveSocketStatus } = useWgServer(serverId);
  const [liveSpeedPoints, setLiveSpeedPoints] = useState<
    { t: string; rx: number; tx: number }[]
  >([]);

  useEffect(() => {
    store.loadServer(serverId).then();
    store.loadServerStatus(serverId).then();
    stats.loadServerStats(serverId).then();
    peersStore.loadPeersByServer(serverId).then();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [serverId]);

  useEffect(() => {
    if (!liveStats) return;
    const t = new Date().toLocaleTimeString("en", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
    setLiveSpeedPoints(prev => [
      ...prev.slice(-59),
      { t, rx: liveStats.rxSpeedBps, tx: liveStats.txSpeedBps },
    ]);
  }, [liveStats]);

  const server = store.server;
  const liveStatus = store.liveStatus;
  const effectiveStatus =
    liveSocketStatus?.status ?? server?.status ?? "unknown";
  const peerCount = liveSocketStatus?.peerCount ?? liveStatus?.peerCount;
  const activePeerCount =
    liveSocketStatus?.activePeerCount ?? liveStatus?.activePeerCount;

  if (store.isLoading) {
    return (
      <div className="flex flex-col h-full">
        <PageHeader
          title="Server"
          breadcrumbs={[
            { label: "Servers", href: "/wireguard/servers" },
            { label: "..." },
          ]}
        />
        <div className="flex justify-center py-12">
          <Spinner />
        </div>
      </div>
    );
  }

  if (!server)
    return <div className="p-6 text-[var(--muted-foreground)]">Server not found</div>;

  const handleAction = async (action: "start" | "stop" | "restart") => {
    setActionLoading(action);
    let res;
    if (action === "start") res = await store.startServer(serverId);
    else if (action === "stop") res = await store.stopServer(serverId);
    else res = await store.restartServer(serverId);
    setActionLoading("");
    if (res?.error) toast.error(res.error.message);
  };

  const trafficData = (stats.serverStats?.traffic ?? []).map(t => ({
    time: new Date(t.timestamp).toLocaleTimeString("en", {
      hour: "2-digit",
      minute: "2-digit",
    }),
    rx: t.rxBytes,
    tx: t.txBytes,
  }));

  const peerColumns: TableColumn<PeerModel>[] = [
    {
      key: "name",
      title: "Name",
      render: (_, peer) => (
        <span className="font-medium text-[var(--foreground)]">
          {peer.name}
        </span>
      ),
    },
    {
      key: "ip",
      title: "IP",
      render: (_, peer) => (
        <span className="font-mono text-xs text-[var(--muted-foreground)]">
          {peer.data.allowedIPs}
        </span>
      ),
    },
    {
      key: "status",
      title: "Status",
      render: (_, peer) => (
        <PeerStatusBadge enabled={peer.enabled} isExpired={peer.isExpired} />
      ),
    },
    {
      key: "expires",
      title: "Expires",
      render: (_, peer) => (
        <span className="text-xs text-[var(--muted-foreground)]">
          {peer.expiresAtFormatted ?? "Never"}
        </span>
      ),
    },
    {
      key: "created",
      title: "Created",
      render: (_, peer) => (
        <span className="text-xs text-[var(--muted-foreground)]">
          {peer.createdAtFormatted}
        </span>
      ),
    },
  ];

  return (
    <div className="flex flex-col h-full">
      <PageHeader
        title={server.name}
        breadcrumbs={[
          { label: "Servers", href: "/wireguard/servers" },
          { label: server.name },
        ]}
        actions={
          <div className="flex items-center gap-1">
            <button
              title="Edit"
              className="cursor-pointer p-2 rounded-lg text-[var(--muted-foreground)] hover:bg-[var(--bg-hover,rgba(255,255,255,0.06))] hover:text-[var(--foreground)] transition-colors"
              onClick={() => setEditOpen(true)}
            >
              <Pencil size={17} />
            </button>
            <button
              title="Start"
              className="cursor-pointer p-2 rounded-lg text-[var(--muted-foreground)] hover:bg-[rgba(34,197,94,0.1)] hover:text-[#16a34a] transition-colors disabled:opacity-40"
              disabled={actionLoading === "start" || effectiveStatus === "up"}
              onClick={() => handleAction("start")}
            >
              <Play size={17} />
            </button>
            <button
              title="Stop"
              className="cursor-pointer p-2 rounded-lg text-[var(--muted-foreground)] hover:bg-[rgba(234,179,8,0.1)] hover:text-[#ca8a04] transition-colors disabled:opacity-40"
              disabled={actionLoading === "stop" || effectiveStatus === "down"}
              onClick={() => handleAction("stop")}
            >
              <Square size={17} />
            </button>
            <button
              title="Restart"
              className="cursor-pointer p-2 rounded-lg text-[var(--muted-foreground)] hover:bg-[rgba(99,102,241,0.1)] hover:text-[#6366f1] transition-colors disabled:opacity-40"
              disabled={actionLoading === "restart"}
              onClick={() => handleAction("restart")}
            >
              <RotateCcw size={17} />
            </button>
          </div>
        }
      />

      <div className="p-6 flex flex-col gap-6 overflow-y-auto">
        {/* Status cards */}
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
          <Card padding="md">
            <p className="text-xs text-[var(--muted-foreground)] uppercase tracking-wider mb-1">
              Status
            </p>
            <ServerStatusBadge status={effectiveStatus} />
          </Card>
          <Card padding="md">
            <p className="text-xs text-[var(--muted-foreground)] uppercase tracking-wider mb-1">
              Interface
            </p>
            <p className="font-mono text-sm font-semibold text-[var(--foreground)]">
              {server.interface}
            </p>
          </Card>
          <Card padding="md">
            <p className="text-xs text-[var(--muted-foreground)] uppercase tracking-wider mb-1">
              Total peers
            </p>
            <p className="text-2xl font-bold text-[var(--foreground)]">
              {peerCount ?? "—"}
            </p>
          </Card>
          <Card padding="md">
            <p className="text-xs text-[var(--muted-foreground)] uppercase tracking-wider mb-1">
              Active peers
            </p>
            <p className="text-2xl font-bold text-green-500">
              {activePeerCount ?? "—"}
            </p>
          </Card>
        </div>

        {/* Live speed stat cards */}
        {liveStats && (
          <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
            <StatCard
              title="RX Speed"
              value={formatSpeed(liveStats.rxSpeedBps)}
              subtitle="Download"
              color="info"
            />
            <StatCard
              title="TX Speed"
              value={formatSpeed(liveStats.txSpeedBps)}
              subtitle="Upload"
              color="success"
            />
            <StatCard
              title="Total RX"
              value={formatBytes(liveStats.totalRxBytes)}
              subtitle="Downloaded"
              color="purple"
            />
            <StatCard
              title="Total TX"
              value={formatBytes(liveStats.totalTxBytes)}
              subtitle="Uploaded"
              color="warning"
            />
          </div>
        )}

        <Tabs
          items={[
            {
              key: "live",
              label: "Live speed",
              children: (
                <Card title="Live speed" subtitle="Real-time RX / TX">
                  <div className="h-48">
                    <ResponsiveContainer width="100%" height={192}>
                      <LineChart data={liveSpeedPoints}>
                        <CartesianGrid
                          strokeDasharray="3 3"
                          stroke="var(--border)"
                        />
                        <XAxis
                          dataKey="t"
                          tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                        />
                        <YAxis
                          tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                          tickFormatter={v => formatSpeed(v)}
                        />
                        <Tooltip
                          contentStyle={{
                            background: "var(--card)",
                            border: "1px solid var(--border)",
                            borderRadius: 8,
                            fontSize: 12,
                          }}
                          formatter={(v: number, name: string) => [
                            formatSpeed(v),
                            name === "rx" ? "Download" : "Upload",
                          ]}
                        />
                        <Line
                          type="monotone"
                          dataKey="rx"
                          stroke="#6366f1"
                          strokeWidth={2}
                          dot={false}
                          name="rx"
                        />
                        <Line
                          type="monotone"
                          dataKey="tx"
                          stroke="#22c55e"
                          strokeWidth={2}
                          dot={false}
                          name="tx"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="flex gap-4 mt-2">
                    <span className="flex items-center gap-1.5 text-xs text-[var(--muted-foreground)]">
                      <span className="w-3 h-0.5 bg-[#6366f1] inline-block" />{" "}
                      Download
                    </span>
                    <span className="flex items-center gap-1.5 text-xs text-[var(--muted-foreground)]">
                      <span className="w-3 h-0.5 bg-[#22c55e] inline-block" />{" "}
                      Upload
                    </span>
                  </div>
                </Card>
              ),
            },
            {
              key: "overview",
              label: "Traffic history",
              children: (
                <Card title="Traffic history (24h)">
                  <div className="h-56">
                    <ResponsiveContainer width="100%" height={224}>
                      <AreaChart data={trafficData}>
                        <CartesianGrid
                          strokeDasharray="3 3"
                          stroke="var(--border)"
                        />
                        <XAxis
                          dataKey="time"
                          tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                        />
                        <YAxis
                          tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                          tickFormatter={v => formatBytes(v)}
                        />
                        <Tooltip
                          contentStyle={{
                            background: "var(--card)",
                            border: "1px solid var(--border)",
                            borderRadius: 8,
                            fontSize: 12,
                          }}
                          formatter={(v: number, name: string) => [
                            formatBytes(v),
                            name === "rx" ? "Download" : "Upload",
                          ]}
                        />
                        <Area
                          type="monotone"
                          dataKey="rx"
                          stroke="#6366f1"
                          fill="#6366f120"
                          strokeWidth={2}
                          name="rx"
                        />
                        <Area
                          type="monotone"
                          dataKey="tx"
                          stroke="#22c55e"
                          fill="#22c55e20"
                          strokeWidth={2}
                          name="tx"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </Card>
              ),
            },
            {
              key: "config",
              label: "Configuration",
              children: (
                <Card title="Server configuration" padding="md">
                  <dl className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
                    {[
                      ["Interface", server.interface],
                      ["Listen port", String(server.listenPort)],
                      ["Address", server.address],
                      ["Endpoint", server.endpoint ?? "—"],
                      ["DNS", server.dns ?? "—"],
                      ["MTU", server.mtu ? String(server.mtu) : "—"],
                      ["Status", server.status],
                      ["Enabled", server.enabled ? "Yes" : "No"],
                    ].map(([k, v]) => (
                      <div key={k}>
                        <dt className="text-xs text-[var(--muted-foreground)]">
                          {k}
                        </dt>
                        <dd className="font-medium text-[var(--foreground)] mt-0.5">
                          {v}
                        </dd>
                      </div>
                    ))}
                  </dl>
                  {server.publicKey && (
                    <div className="mt-4 pt-4 border-t border-[var(--border)]">
                      <p className="text-xs text-[var(--muted-foreground)] mb-1">
                        Public Key
                      </p>
                      <CopyableText
                        className={"text-[var(--muted-foreground)]"}
                        truncate={false}
                        text={server.publicKey}
                      />
                    </div>
                  )}
                </Card>
              ),
            },
          ]}
        />

        {/* Peers list */}
        <Card
          title="Peers"
          extra={<Badge variant="gray">{peersStore.total} total</Badge>}
          padding="none"
        >
          <Table
            columns={peerColumns}
            data={peersStore.models}
            rowKey={p => p.data.id}
            loading={peersStore.isLoading}
            emptyText="No peers"
            emptyDescription="No peers configured for this server"
            onRowClick={peer =>
              navigate({
                to: "/wireguard/peers/$peerId",
                params: { peerId: peer.data.id },
              })
            }
          />
        </Card>
      </div>

      <Modal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        title="Edit server"
        size="lg"
      >
        <ServerForm
          isEdit
          defaultValues={server}
          onCancel={() => setEditOpen(false)}
          onSubmit={async data => {
            const res = await store.updateServer(serverId, data as any);
            if (res.error) {
              toast.error(res.error.message);
            } else {
              toast.success("Server updated");
              setEditOpen(false);
            }
          }}
        />
      </Modal>
    </div>
  );
});
