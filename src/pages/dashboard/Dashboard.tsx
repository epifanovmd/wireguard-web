import { useNavigate } from "@tanstack/react-router";
import { Download, Server, Upload, Zap } from "lucide-react";
import { observer } from "mobx-react-lite";
import React, { FC, useEffect, useState } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { EWgServerStatus } from "~@api/api-gen/data-contracts";
import { Badge, Card, PageHeader, Spinner, StatCard } from "~@components";
import { useServersDataStore } from "~@store";

import { useWgOverview } from "../../socket";
import { formatSpeed } from "./dashboard.helpers";

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

  return (
    <div className="flex flex-col h-full">
      <PageHeader title="Dashboard" subtitle="WireGuard VPN overview" />
      <div className="flex-1 p-6 flex flex-col gap-6 overflow-y-auto">
        {/* Stat cards */}
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
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
        <Card title="Live speed" subtitle="Real-time download / upload">
          <div className="h-48">
            <ResponsiveContainer width="100%" height={192}>
              <LineChart data={livePoints}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="var(--border-color)"
                />
                <XAxis
                  dataKey="t"
                  tick={{ fontSize: 11, fill: "var(--text-muted)" }}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: "var(--text-muted)" }}
                  tickFormatter={v => formatSpeed(v)}
                />
                <Tooltip
                  contentStyle={{
                    background: "var(--bg-surface)",
                    border: "1px solid var(--border-color)",
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
            <span className="flex items-center gap-1.5 text-xs text-[var(--text-muted)]">
              <span className="w-3 h-0.5 bg-[#6366f1] inline-block" /> Download
            </span>
            <span className="flex items-center gap-1.5 text-xs text-[var(--text-muted)]">
              <span className="w-3 h-0.5 bg-[#22c55e] inline-block" /> Upload
            </span>
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
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[var(--border-color)]">
                    <th className="text-left px-3 py-2.5 text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">
                      Name
                    </th>
                    <th className="text-left px-3 py-2.5 text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">
                      Interface
                    </th>
                    <th className="text-left px-3 py-2.5 text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">
                      Status
                    </th>
                    <th className="text-left px-3 py-2.5 text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">
                      Port
                    </th>
                    <th className="text-left px-3 py-2.5 text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">
                      Endpoint
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {servers.servers.length === 0 ? (
                    <tr>
                      <td
                        colSpan={5}
                        className="text-center py-8 text-[var(--text-muted)] text-sm"
                      >
                        No servers configured
                      </td>
                    </tr>
                  ) : (
                    servers.servers.map(server => (
                      <tr
                        key={server.id}
                        className="border-b border-[var(--border-color)] hover:bg-[var(--table-row-hover)] cursor-pointer"
                        onClick={() => navigate({ to: "/wireguard/servers/$serverId", params: { serverId: server.id } })}
                      >
                        <td className="px-3 py-3 font-medium text-[var(--text-primary)]">
                          {server.name}
                        </td>
                        <td className="px-3 py-3 font-mono text-[var(--text-secondary)] text-xs">
                          {server.interface}
                        </td>
                        <td className="px-3 py-3">
                          <ServerStatusBadge status={server.status} />
                        </td>
                        <td className="px-3 py-3 text-[var(--text-secondary)]">
                          {server.listenPort}
                        </td>
                        <td className="px-3 py-3 text-[var(--text-muted)] text-xs">
                          {server.endpoint ?? "—"}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
});

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
