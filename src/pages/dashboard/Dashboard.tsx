import { useNavigate } from "@tanstack/react-router";
import { Download, Server, Upload, Zap } from "lucide-react";
import { observer } from "mobx-react-lite";
import { FC, useEffect, useState } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { EWgServerStatus, WgServerDto } from "~@api/api-gen/data-contracts";
import { PageHeader } from "~@components/layouts";
import {
  Badge,
  Card,
  type ColumnDef,
  Spinner,
  StatCard,
  Table,
} from "~@components/ui2";
import { useServersDataStore } from "~@store";

import { useWgOverview } from "../../socket";
import { formatSpeed } from "./dashboard.helpers";

function ServerStatusBadge({ status }: { status: string }) {
  const map: Record<string, { variant: any; label: string }> = {
    up: { variant: "success", label: "Up" },
    down: { variant: "gray", label: "Down" },
    error: { variant: "danger", label: "Error" },
    unknown: { variant: "default", label: "Unknown" },
  };
  const cfg = map[status] ?? map.unknown;
  return (
    <Badge variant={cfg.variant} dot>
      {cfg.label}
    </Badge>
  );
}

export const Dashboard: FC = observer(() => {
  const servers = useServersDataStore();
  const overview = useWgOverview();
  const navigate = useNavigate();
  const [livePoints, setLivePoints] = useState<
    { t: string; rx: number; tx: number }[]
  >([]);

  useEffect(() => {
    servers.loadServers().then();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!overview) return;
    const t = new Date().toLocaleTimeString("en", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
    setLivePoints(prev => [
      ...prev.slice(-59),
      { t, rx: overview.rxSpeedBps, tx: overview.txSpeedBps },
    ]);
  }, [overview]);

  const activeServers = servers.servers.filter(
    s => s.status === EWgServerStatus.Up,
  );

  const serverColumns: ColumnDef<WgServerDto>[] = [
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => (
        <span className="font-medium text-[var(--foreground)]">{row.original.name}</span>
      ),
    },
    {
      accessorKey: "interface",
      header: "Interface",
      cell: ({ row }) => (
        <span className="font-mono text-[var(--muted-foreground)] text-xs">
          {row.original.interface}
        </span>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => <ServerStatusBadge status={row.original.status} />,
    },
    {
      accessorKey: "listenPort",
      header: "Port",
      cell: ({ row }) => (
        <span className="text-[var(--muted-foreground)]">{row.original.listenPort}</span>
      ),
    },
    {
      accessorKey: "endpoint",
      header: "Endpoint",
      cell: ({ row }) => (
        <span className="text-[var(--muted-foreground)] text-xs">
          {row.original.endpoint ?? "—"}
        </span>
      ),
    },
  ];

  return (
    <div className="flex flex-col h-full">
      <PageHeader title="Dashboard" subtitle="WireGuard VPN overview" />
      <div className="flex-1 p-4 sm:p-6 flex flex-col gap-6 overflow-y-auto">
        {/* Stat cards */}
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4">
          <StatCard
            title="Total servers"
            value={servers.total}
            subtitle={`${activeServers.length} active`}
            color="info"
            icon={<Server size={20} />}
          />
          <StatCard
            title="Total peers"
            value={overview?.totalPeers ?? 0}
            subtitle={`${overview?.activePeers ?? 0} active`}
            color="success"
            icon={<Zap size={20} />}
          />
          <StatCard
            title="RX Speed"
            value={formatSpeed(overview?.rxSpeedBps ?? 0)}
            subtitle="Download speed"
            color="purple"
            icon={<Download size={20} />}
          />
          <StatCard
            title="TX Speed"
            value={formatSpeed(overview?.txSpeedBps ?? 0)}
            subtitle="Upload speed"
            color="warning"
            icon={<Upload size={20} />}
          />
        </div>

        {/* Live speed chart */}
        <Card title="Live speed" description="Real-time download / upload" className="p-0">
          <div className="p-5">
            <div className="h-48">
              <ResponsiveContainer width="100%" height={192}>
                <LineChart data={livePoints}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
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
                <span className="w-3 h-0.5 bg-[#6366f1] inline-block" /> Download
              </span>
              <span className="flex items-center gap-1.5 text-xs text-[var(--muted-foreground)]">
                <span className="w-3 h-0.5 bg-[#22c55e] inline-block" /> Upload
              </span>
            </div>
          </div>
        </Card>

        {/* Servers table */}
        <Card
          title="Servers"
          extra={
            <Badge variant={activeServers.length > 0 ? "success" : "gray"} dot>
              {activeServers.length} / {servers.total} active
            </Badge>
          }
        >
          {servers.isLoading ? (
            <div className="flex justify-center py-8">
              <Spinner />
            </div>
          ) : (
            <Table
              columns={serverColumns}
              data={servers.servers}
              getRowId={s => s.id}
              empty={<div className="text-center py-8 text-[var(--muted-foreground)] text-sm">No servers configured</div>}
              onRowClick={s =>
                navigate({
                  to: "/wireguard/servers/$serverId",
                  params: { serverId: s.id },
                })
              }
            />
          )}
        </Card>
      </div>
    </div>
  );
});
