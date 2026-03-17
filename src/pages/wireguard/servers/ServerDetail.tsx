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

import { PageHeader } from "~@components/layouts";
import {
  Badge,
  Button,
  Card,
  type ColumnDef,
  CopyableText,
  IconButton,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  ModalTitle,
  Spinner,
  StatCard,
  Table,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  useToast,
} from "~@components/ui2";
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

  if (store.serverHolder.isLoading || !store.serverHolder.isReady) {
    return (
      <div className="flex flex-col h-full">
        <PageHeader title="Server" />
        <div className="flex justify-center py-12">
          <Spinner />
        </div>
      </div>
    );
  }

  if (!server)
    return (
      <div className="p-6 text-[var(--muted-foreground)]">Server not found</div>
    );

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

  const peerColumns: ColumnDef<PeerModel>[] = [
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => (
        <span className="font-medium text-[var(--foreground)]">
          {row.original.name}
        </span>
      ),
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
      cell: ({ row }) => (
        <PeerStatusBadge
          enabled={row.original.enabled}
          isExpired={row.original.isExpired}
        />
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
      accessorKey: "createdAt",
      header: "Created",
      cell: ({ row }) => (
        <span className="text-xs text-[var(--muted-foreground)]">
          {row.original.createdAtFormatted}
        </span>
      ),
    },
  ];

  return (
    <div className="flex flex-col h-full">
      <PageHeader
        title={server.name}
        actions={
          <div className="flex items-center gap-1">
            <IconButton
              title="Edit"
              variant="ghost"
              size="sm"
              onClick={() => setEditOpen(true)}
            >
              <Pencil size={17} />
            </IconButton>
            <IconButton
              title="Start"
              variant="ghost"
              size="sm"
              disabled={actionLoading === "start" || effectiveStatus === "up"}
              onClick={() => handleAction("start")}
            >
              <Play size={17} className="text-success" />
            </IconButton>
            <IconButton
              title="Stop"
              variant="ghost"
              size="sm"
              disabled={actionLoading === "stop" || effectiveStatus === "down"}
              onClick={() => handleAction("stop")}
            >
              <Square size={17} className="text-warning" />
            </IconButton>
            <IconButton
              title="Restart"
              variant="ghost"
              size="sm"
              disabled={actionLoading === "restart"}
              onClick={() => handleAction("restart")}
            >
              <RotateCcw size={17} />
            </IconButton>
          </div>
        }
      />

      <div className="p-4 sm:p-6 flex flex-col gap-6 overflow-y-auto">
        {/* Status cards */}
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4">
          <Card className="p-5">
            <p className="text-xs text-[var(--muted-foreground)] uppercase tracking-wider mb-2">
              Status
            </p>
            <ServerStatusBadge status={effectiveStatus} />
          </Card>
          <Card className="p-5">
            <p className="text-xs text-[var(--muted-foreground)] uppercase tracking-wider mb-1">
              Interface
            </p>
            <p className="font-mono text-sm font-semibold text-[var(--foreground)]">
              {server.interface}
            </p>
          </Card>
          <Card className="p-5">
            <p className="text-xs text-[var(--muted-foreground)] uppercase tracking-wider mb-1">
              Total peers
            </p>
            <p className="text-2xl font-bold text-[var(--foreground)]">
              {peerCount ?? "—"}
            </p>
          </Card>
          <Card className="p-5">
            <p className="text-xs text-[var(--muted-foreground)] uppercase tracking-wider mb-1">
              Active peers
            </p>
            <p className="text-2xl font-bold text-success">
              {activePeerCount ?? "—"}
            </p>
          </Card>
        </div>

        {/* Live speed stat cards */}
        {liveStats && (
          <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4">
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

        <Tabs defaultValue="live">
          <TabsList>
            <TabsTrigger value="live">Live speed</TabsTrigger>
            <TabsTrigger value="overview">Traffic history</TabsTrigger>
            <TabsTrigger value="config">Configuration</TabsTrigger>
          </TabsList>
          <TabsContent value="live">
            <Card
              title="Live speed"
              description="Real-time RX / TX"
              className="mt-2 p-5"
            >
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
          </TabsContent>
          <TabsContent value="overview">
            <Card title="Traffic history (24h)" className="mt-2 p-5">
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
          </TabsContent>
          <TabsContent value="config">
            <Card title="Server configuration" className="mt-2 p-5">
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
                    className="text-[var(--muted-foreground)]"
                    truncate={false}
                    text={server.publicKey}
                  />
                </div>
              )}
            </Card>
          </TabsContent>
        </Tabs>

        {/* Peers list */}
        <Card
          title="Peers"
          extra={<Badge variant="gray">{peersStore.total} total</Badge>}
        >
          <Table
            columns={peerColumns}
            data={peersStore.models}
            getRowId={p => p.data.id}
            loading={peersStore.isLoading}
            empty={
              <div className="text-center py-6 text-[var(--muted-foreground)] text-sm">
                No peers configured for this server
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

      <Modal open={editOpen} onOpenChange={open => !open && setEditOpen(false)}>
        <ModalOverlay />
        <ModalContent className="max-w-lg">
          <ModalHeader>
            <ModalTitle>Edit server</ModalTitle>
          </ModalHeader>
          <ModalBody>
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
          </ModalBody>
        </ModalContent>
      </Modal>
    </div>
  );
});
